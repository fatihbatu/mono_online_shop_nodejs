const { ProductRepository } = require('../database');
const { FormateData } = require('../utils');
const { APIError } = require('../utils/app-errors');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during creating product.'
      );
    }
  }

  async getProducts() {
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
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting products.'
      );
    }
  }

  async GetProductDescription(productId) {
    try {
      const product = await this.repository.FindById(productId);
      return FormateData(product);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting product description.'
      );
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category);
      return FormateData(products);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting products by category.'
      );
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting selected products.'
      );
    }
  }

  async GetProductById(productId) {
    try {
      return await this.repository.FindById(productId);
    } catch (error) {
      throw new APIError(
        'Data Not Found',
        err.message || 'An error occurred during getting product by id.'
      );
    }
  }
}

module.exports = ProductService;
