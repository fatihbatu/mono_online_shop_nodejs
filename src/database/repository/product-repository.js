const { CustomerModel, AddressModel, ProductModel } = require('../models');
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
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
    } catch (error) {
      throw new APIError('API Error', STATUS_CODES, 'Unable to Create Product');
    }
  }

  async Products() {
    try {
      return await ProductModel.find();
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Get Products'
      );
    }
  }

  async findById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Get Products'
      );
    }
  }

  async FindByCategory(category) {
    try {
      // Check what is the difference between below and return await ProductModel.find({ type: category });
      const products = await ProductModel.find({ type: category });
      return products;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Category'
      );
    }
  }

  async findSelectedProducts(selectedIds) {
    try {
      const products = await ProductModel.find({ _id: { $in: selectedIds } });
      // const products = await ProductModel.find()
      // .where('_id')
      // .in(selectedIds.map((_id) => _id))
      // .exec();
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find Product'
      );
    }
  }
}

module.exports = ProductRepository;
