const {
  ValidatePassword,
  FormateData,
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
} = require('../utils');
const {
  APIError,
  ValidationError,
  STATUS_CODES,
  BadRequestError,
  AppError,
} = require('../utils/app-errors');
const { CustomerRepository } = require('../database');

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      // If the customer doesn't exist or the password is invalid, return formatted null data
      if (!existingCustomer) {
        throw new BadRequestError(
          'Customer Not Found',
          undefined,
          'The provided email does not match any account.'
        );
      }

      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );

      if (!validPassword) {
        throw new APIError(
          'Invalid Password',
          undefined,
          'The provided password is incorrect.'
        );
      }

      const token = await GenerateSignature({
        email: existingCustomer.email,
        _id: existingCustomer._id,
      });

      return FormateData({ id: existingCustomer._id, token });
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;
    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        throw new ValidationError('The provided email already exists.');
      }
      if (!existingCustomer) {
        const salt = await GenerateSalt();

        const hashedPassword = await GeneratePassword(password, salt);

        const newCustomer = await this.repository.CreateCustomer({
          email,
          password: hashedPassword,
          phone,
          salt,
        });

        const token = await GenerateSignature({
          email: newCustomer.email,
          _id: newCustomer._id,
        });

        return FormateData({ id: newCustomer._id, token });
      }
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;
    try {
      const addressResult = await this.repository.CreateAdress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetProfile(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetShopingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      if (!existingCustomer) {
        throw new APIError(
          'Customer Not Found',
          undefined,
          'The provided email does not match any account.'
        );
      }
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetWislist(customerId) {
    try {
      const wishListıtems = await this.repository.Wishlist(customerId);
      return FormateData(wishListıtems);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async AddToWishlist(customerId, product) {
    try {
      const wishlistResult = await this.repository.AddWishlistItem(
        customerId,
        product
      );
      return FormateData(wishlistResult);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async RemoveFromWishlist(customerId, productId) {
    try {
      const wishlistResult = await this.repository.RemoveWishlistItem(
        customerId,
        productId
      );
      return wishlistResult;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      } else {
        throw new APIError(
          'API Error',
          STATUS_CODES.INTERNAL_ERROR,
          'Unable to Remove Item'
        );
      }
    }
  }

  async ManageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async ManageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async SubscribeEvents(payload) {
    const { event, data } = payload;

    const { userId, product, qty, order } = data;

    switch (event) {
      case 'ADD_TO_WISHLIST':
      case 'REMOVE_FROM_WISHLIST':
        this.AddToWishlist(userId, product);
        break;
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false);
        break;
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true);
        break;
      case 'CREATE_ORDER':
        this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;
