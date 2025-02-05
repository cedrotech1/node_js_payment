const express = require("express");
const router = express.Router();
const { cashin, cashout, transactions } = require("../controllers/paymentController");

// Define routes
router.post("/cashin", cashin);
router.post("/cashout", cashout);
router.get("/transactions", transactions);

module.exports = router;
