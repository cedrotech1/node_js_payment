const express = require("express");
const router = express.Router();
const { getAccount } = require("../controllers/accountController");

// Define route
router.get("/account", getAccount);

module.exports = router;
