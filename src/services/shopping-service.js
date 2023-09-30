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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during placing order.'
      );
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting orders.'
      );
    }
  }
}

module.exports = ShoppingService;
