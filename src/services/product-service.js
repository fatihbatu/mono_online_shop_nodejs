const { ProductRepository } = require('../database');
const { FormateData } = require('../utils');
const {
  APIError,
  ConflictError,
  BadRequestError,
} = require('../utils/app-errors');
const ErrorHandler = require('../utils/error-handler');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const isProductExist = await this.repository.FindByName(
        productInputs.name
      );
      if (isProductExist) {
        throw new ConflictError('Product Already Exist', 409, 'x', true);
      }
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.description || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();
      let categories = {};
      products.map(({ type }) => {
        categories[type] = type;
      });

      return FormateData({
        products,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetProductDescription(productId) {
    try {
      const product = await this.repository.FindById(productId);
      if (!product) {
        throw new BadRequestError();
      }
      return FormateData(product);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category);
      return FormateData(products);
    } catch (err) {
      throw new APIError('Data Not Found');
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err) {
      throw new APIError(
        err.name || 'Data Not Found',
        err.statusCode || undefined,
        err.message || 'An error occurred during creating product.',
        err.isOperational || false
      );
    }
  }

  async GetProductById(productId) {
    try {
      const product = await this.repository.FindById(productId);
      if (!product) {
        throw new BadRequestError();
      }
      return product;
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

module.exports = ProductService;
