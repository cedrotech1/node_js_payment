const paypack = require("../config/paypackConfig");
const axios = require("axios");

// const checkTransactionStatus = (transactionId, callback) => {
//   paypack.getTransaction(transactionId, (error, response) => {
//     if (error) {
//       return callback(error, null);
//     }
//     callback(null, response);
//   });
// };


// const cashin = (req, res) => {
  // const { number, amount } = req.body;

  // if (!number || !amount) {
  //   return res.status(400).json({ error: "Missing 'number' or 'amount' parameter" });
  // }

  // paypack.cashin({ number, amount, environment: 'development' }, (error, response) => {
  //   if (error) {
  //     console.error("Error during cash-in:", error);
  //     return res.status(500).json({ error: error.message });
  //   }
  //   // console.log("Cash-in response:", response);

  //   if (response.success) {
  //     const transactionId = response.data.transactionId;

  //     // Check transaction status after cash-in
  //     checkTransactionStatus(transactionId, (err, transactionResponse) => {
  //       if (err) {
  //         console.error("Error fetching transaction status:", err);
  //         return res.status(500).json({ error: "Failed to fetch transaction status" });
  //       }

  //       const { event, status } = transactionResponse.data;
        
  //       if (event === "transaction:created") {
  //         return res.json({ message: "Transaction pending", transactionId, status });
  //       } else if (event === "transaction:processed") {
  //         return res.json({ message: "Transaction processed", transactionId, status });
  //       } else {
  //         return res.json({ message: "Unknown event", transactionId, status });
  //       }
  //     });
  //   } else {
  //     res.status(400).json({ error: response.error });
  //   }
  // });
  // const cashin = (req, res) => {
  //   paypack.cashin({
  //     number: "0784366616",
  //     amount: 100,
  //     environment: "development",
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //       res.json({ message: "Transaction processed", ref: response.data.transactionId });
  //     })
  //     .catch((err) => {
  //       console.error("Cash-in error:", err);
  //       res.status(500).json({ error: "Cash-in failed", details: err.message });
  //     });
  // };
  


  
  const listenForTransactionEvents = (transactionId, callback) => {
    const interval = setInterval(async () => {
      try {
        const response = await paypack.events({ offset: 0, limit: 100 });
  
        const events = response.data.transactions;
        const transactionEvent = events.find(
          (event) => event.data.ref === transactionId && event.event_kind === "transaction:processed"
        );
  
        if (transactionEvent) {
          clearInterval(interval); // Stop polling
          callback(null, transactionEvent);
        }
      } catch (error) {
        clearInterval(interval);
        callback(error, null);
      }
    }, 5000); // Check every 5 seconds
  };
  
  const cashin = (req, res) => {

      const { number, amount } = req.body;

  if (!number || !amount) {
    return res.status(400).json({ error: "Missing 'number' or 'amount' parameter" });
  }

    paypack
      .cashin({
        number,
        amount,
        environment: "development",
      })
      .then((response) => {
        console.log("Transaction initiated:", response.data);
        const transactionId = response.data.ref;
  
        res.json({
          message: "Transaction initiated. Waiting for user confirmation.",
          ref: transactionId,
        });
  
        // Start checking transaction events
        listenForTransactionEvents(transactionId, (err, transactionData) => {
          if (err) {
            console.error("Transaction event check failed:", err);
          } else {
            console.log("Final transaction status:", transactionData);
          }
        });
      })
      .catch((err) => {
        console.error("Cash-in error:", err);
        res.status(500).json({ error: "Cash-in failed", details: err.message });
      });
  };


  



// Process Cash-Out
const cashout = async (req, res) => {
  const { number, amount, environment } = req.body;

  // Validate input
  if (!number || !amount) {
    return res.status(400).json({ error: "Missing 'number' or 'amount' parameter" });
  }

  try {
    // Call Paypack API for cash-out operation
    const response = await paypack.cashout({ number, amount, environment });
    if (response.success) {
      res.json({ message: "Cash-out successful", data: response.data });
    } else {
      res.status(400).json({ error: response.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Transactions
const transactions = async (req, res) => {
  let { offset, limit } = req.query;

  offset = parseInt(offset);
  limit = parseInt(limit);

  if (isNaN(offset) || isNaN(limit)) {
    return res.status(400).json({ error: "Invalid offset or limit parameter" });
  }

  try {
    // Call Paypack API to get transactions
    const response = await paypack.transactions({ offset, limit });
    res.json({ message: "Transactions fetched successfully", data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle generic payment processing (for product/service payments)
const processPayment = async (req, res) => {
  const { number, amount, environment, paymentType } = req.body;

  // Validate input
  if (!number || !amount || !paymentType) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    let paymentResponse;

    // Call the appropriate Paypack API depending on payment type
    if (paymentType === 'cashin') {
      paymentResponse = await paypack.cashin({ number, amount, environment });
    } else if (paymentType === 'cashout') {
      paymentResponse = await paypack.cashout({ number, amount, environment });
    } else {
      return res.status(400).json({ error: "Invalid payment type" });
    }

    if (paymentResponse.success) {
      res.json({ message: `${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} successful`, data: paymentResponse.data });
    } else {
      res.status(400).json({ error: paymentResponse.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions at once
module.exports = { cashin, cashout, transactions, processPayment };
