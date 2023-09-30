const { ValidatePassword, FormateData } = require('../utils');
const { APIError } = require('../utils/app-errors');
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
        throw new APIError(
          'Customer Not Found',
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
          'The provided password is incorrect.'
        );
      }

      const token = await GenerateSignature({
        email: existingCustomer.email,
        _id: existingCustomer._id,
      });

      return FormateData({ id: existingCustomer._id, token });
    } catch (err) {
      // Handle generic error. You might want to ensure that you don't expose sensitive details in the error message.
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during sign in.'
      );
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;
    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        throw new APIError(
          'Customer Already Exists',
          'The provided email is already in use.'
        );
      }

      const salt = await GenerateSalt();

      const hashedPassword = await HashPassword(password, salt);

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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during sign up.'
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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during adding new address.'
      );
    }
  }

  async GetProfile(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      return FormateData(existingCustomer);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting profile.'
      );
    }
  }

  async GetShopingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      if (!existingCustomer) {
        throw new APIError(
          'Customer Not Found',
          'The provided email does not match any account.'
        );
      }
      return FormateData(existingCustomer);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting shoping details.'
      );
    }
  }

  async GetWislist(customerId) {
    try {
      const wishListıtems = await this.repository.Wishlist(customerId);
      return FormateData(wishListıtems);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting wishlist.'
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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during adding to wishlist.'
      );
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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during managing cart.'
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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during managing order.'
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
