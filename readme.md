```markdown
# Payment API

This is a simple API for handling payment operations (cash-in, transaction, and account info) using Paypack.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/cedrotech1/node_js_payment.git
   cd node_js_payment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add your Paypack credentials(copy .env example and rename it .env):

   ```bash
   touch .env
   ```

   Example `.env` file:

   ```
   PAYPACK_CLIENT_ID=your-client-id
   PAYPACK_CLIENT_SECRET=your-client-secret
   PAYPACK_ENVIRONMENT=production # or sandbox
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:[PORT=4000]`.

## Documentation
swagger documentation 
- [http://localhost:PORT/api-docs](http://localhost:PORT/api-docs)
paypack documentation 
- [Paypack API Documentation](https://docs.paypack.rw/)

Enjoy using the Payment API!
```
