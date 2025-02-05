const paypack = require("../config/paypackConfig");

const getAccount = async (req, res) => {
  try {
    const response = await paypack.me();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions at once
module.exports = { getAccount };
