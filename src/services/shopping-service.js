const { ShoppingRepository } = require('../database');
const { FormateData } = require('../utils');

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }
}

module.exports = ShoppingService;
