// src/index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./documentation/swagger');
const paymentRoutes = require("./routes/paymentRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register routes
app.use('/api/payment', paymentRoutes);
app.use('/api/', accountRoutes);

app.listen(port, () => {
  console.log(`Payment API is running on http://localhost:${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});
