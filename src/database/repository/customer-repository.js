const { APIError } = require('../../utils/app-errors');
const { CustomerModel, AddressModel } = require('../models');

class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        phone,
        salt,
        phone,
        address: [],
      });
      const customerResult = await customer.save();
      return customerResult;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Create Customer'
      );
    }
  }

  async CreateAdress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);

      if (profile) {
        const newAddress = new AddressModel({
          street,
          postalCode,
          city,
          country,
        });

        await newAddress.save();
        profile.address.push(newAddress);
      }
      return await profile.save();
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Create Address'
      );
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email });
      return existingCustomer;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Customer'
      );
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingCustomer = await CustomerModel.findById(id)
        .populate('address')
        .populate('wishlist')
        .populate('orders')
        .populate('cart.product');
      return existingCustomer;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Customer'
      );
    }
  }

  async Wishlist(customerId) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        'wishlist'
      );
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Customer'
      );
    }
  }

  async AddWishlistItem(customerId, product) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        'wishlist'
      );

      // Check is causeing error

      //   if (profile) {
      //     const index = profile.wishlist.findIndex((item) => {
      //       return item._id.toString() === product._id.toString();
      //     });
      //     if (index !== -1) {
      //       profile.wishlist.splice(index, 1);
      //     } else {
      //       profile.wishlist.push(product);
      //     }
      //   }

      if (!profile) {
        throw new APIError(
          'API Error',
          STATUS_CODES.BAD_REQUEST,
          'Unable to Find Customer'
        );
      }
      const index = profile.wishlist.findIndex((item) => {
        return item._id.toString() === product._id.toString();
      });
      if (index !== -1) {
        profile.wishlist.splice(index, 1);
      } else {
        profile.wishlist.push(product);
      }
      const profileResult = await profile.save();
      return profileResult.wishlist;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Wishlist'
      );
    }
  }

  async AddCartItem(customerId, product, qty, isRemove) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        'cart.product'
      );

      if (!profile) {
        throw new APIError(
          'API Error',
          STATUS_CODES.BAD_REQUEST, // Assuming you have a BAD_REQUEST status code
          'Profile not found'
        );
      }

      const cartItemIndex = profile.cart.findIndex(
        (item) => item.product._id.toString() === product._id.toString()
      );

      if (cartItemIndex !== -1) {
        // If the product exists in the cart
        if (isRemove) {
          profile.cart.splice(cartItemIndex, 1);
        } else {
          profile.cart[cartItemIndex].unit = qty;
        }
      } else if (!isRemove) {
        // If the product doesn't exist and we aren't trying to remove it, add it
        profile.cart.push({ product, unit: qty });
      }

      const cartSaveResult = await profile.save();
      return cartSaveResult.cart;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Create Customer'
      );
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId);

      if (!profile) {
        throw new APIError(
          'API Error',
          STATUS_CODES.BAD_REQUEST, // Assuming you have a BAD_REQUEST status code
          'Profile not found'
        );
      }

      if (!profile.orders) {
        profile.orders = [];
      }

      profile.orders.push(order);

      profile.cart = [];

      const profileResult = await profile.save();

      return profileResult.orders;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Add Order to Profile'
      );
    }
  }
}

module.exports = CustomerRepository;
