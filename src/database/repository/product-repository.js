const { CustomerModel, AddressModel, ProductModel } = require('../models');
const {
  APIError,
  BadRequestError,
  ValidationError,
  STATUS_CODES,
  NotFoundError,
} = require('../../utils/app-errors');

// Dealing with the database operations

class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    try {
      const product = new ProductModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Create Product'
      );
    }
  }

  async Products() {
    try {
      return await ProductModel.find();
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Get Products'
      );
    }
  }

  async FindById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new NotFoundError('Product Not Found');
      }
      return product;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      } else {
        throw new APIError(
          'API Error',
          STATUS_CODES.INTERNAL_ERROR,
          'Unable to Find Product'
        );
      }
    }
  }

  async FindByName(name) {
    try {
      const product = await ProductModel.findOne({ name });
      return product;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Product'
      );
    }
  }

  async FindByCategory(category) {
    try {
      // Check what is the difference between below and return await ProductModel.find({ type: category });
      const products = await ProductModel.find({ type: category });
      return products;
    } catch (err) {
      throw new APIError('API Error');
    }
  }

  async FindSelectedProducts(selectedIds) {
    try {
      const products = await ProductModel.find({ _id: { $in: selectedIds } });
      // const products = await ProductModel.find()
      // .where('_id')
      // .in(selectedIds.map((_id) => _id))
      // .exec();
      return products;
    } catch (err) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Product'
      );
    }
  }
}

module.exports = ProductRepository;
