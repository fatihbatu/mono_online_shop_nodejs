const { CustomerModel, OrderModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const {
  APIError,
  BadRequestError,
  ValidationError,
  STATUS_CODES,
} = require('../../utils/app-errors');

class ShoppingRepository {
  //payment

  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId }).populate(
        'items.products'
      );
      return orders;
    } catch (err) {
      throw new APIError('Unable to Find Orders');
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //check transaction for payment Status
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        'cart.product'
      );

      if (!profile) {
        throw new APIError(
          'API ERROR',
          STATUS_CODES.BAD_REQUEST,
          'Unable to find customer'
        );
      }

      if (profile.cart.length > 0) {
        return {};
      }

      const amount = profile.cart.reduce(
        (total, item) =>
          total + parseInt(item.product.price) * parseInt(item.unit),
        0
      );

      const orderId = uuidv4();

      const order = new OrderModel({
        orderId,
        customerId,
        amount,
        txnId,
        status: 'received',
        items: profile.cart,
      });

      profile.cart = [];

      await order.populate('items.product').execPopulate();

      const orderResult = await order.save();

      profile.orders.push(orderResult);

      await profile.save();

      return orderResult;
    } catch (err) {
      throw new APIError(
        'API ERROR',
        STATUS_CODES.BAD_REQUEST,
        'Unable to create order'
      );
    }
  }
}

module.exports = ShoppingRepository;
