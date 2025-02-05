const paypack = require("../config/paypackConfig");


// Process Cash-In
const cashin = async (req, res) => {
    const { number, amount} = req.body;
  
    // Validate input
    if (!number || !amount) {
      return res.status(400).json({ error: "Missing 'number' or 'amount' parameter" });
    }
  
    try {
      const headers = {
        'Webhook-Mode': process.env.PAYPACK_ENVIRONMENT, 
      };
      let environment = process.env.PAYPACK_ENVIRONMENT;
  
      // Call Paypack API for cash-in operation
      const response = await paypack.cashin({ number, amount, environment, headers });
  
      // Check for successful response
      if (response.success) {
        res.json({ message: "Cash-in successful", data: response.data });
      } else {
        res.status(400).json({ error: response.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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
