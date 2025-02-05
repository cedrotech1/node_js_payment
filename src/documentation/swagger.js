// src/documentation/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger Options Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment API',
      version: '1.0.0',
      description: 'API for handling payments, cashin, cashout, and account info.',
    },
    tags: [
        {
          name: 'Payment',
          description: 'Operations related to payment processing, including cashin and cashout.',
        },
        {
          name: 'Account',
          description: 'Operations related to user account information.',
        },
      ],
    paths: {
      '/api/payment/cashin': {
        post: {
          summary: 'Process a cash-in operation',
          tags: ['Payment'], 
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    number: { type: 'string' },
                    amount: { type: 'number' },
                  },
                  example: {
                    number: '0784366616',
                    amount: 100,
                    // environment: 'development', // Example of the environment
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cash-in successful' },
            400: { description: 'Missing "number" parameter' },
            500: { description: 'Internal server error' },
          },
        },
      },
    //   '/api/payment/cashout': {
    //     post: {
    //       summary: 'Process a cash-out operation',
    //       requestBody: {
    //         required: true,
    //         content: {
    //           'application/json': {
    //             schema: {
    //               type: 'object',
    //               properties: {
    //                 number: { type: 'string' },
    //                 amount: { type: 'number' },
    //                 environment: { type: 'string' },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: { description: 'Cash-out successful' },
    //         500: { description: 'Internal server error' },
    //       },
    //     },
    //   },
      '/api/payment/transactions': {
        get: {
          summary: 'Get transactions',
          tags: ['Payment'], 
          parameters: [
            {
              in: 'query',
              name: 'offset',
              schema: { type: 'integer' },
              description: 'Offset for pagination',
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer' },
              description: 'Limit for pagination',
            },
          ],
          responses: {
            200: { description: 'List of transactions' },
            400: { description: 'Invalid offset or limit parameter' },
            500: { description: 'Internal server error' },
          },
        },
      },
      '/api/account': {
        get: {
          summary: 'Get account information',
          tags: ['Account'], 
          responses: {
            200: { description: 'Account information' },
            500: { description: 'Internal server error' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/apiRoutes.js'], // We still point to the route file for API-related comments
};

module.exports = swaggerJsdoc(swaggerOptions);
