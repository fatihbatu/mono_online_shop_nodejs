const ProductService = require('../services/product-service');
const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');
const { BadRequestError, ValidationError } = require('../utils/app-errors');

module.exports = (app) => {
  const service = new ProductService();
  const customerService = new CustomerService();

  app.post('/product/create', async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/:id', async (req, res, next) => {
    const productId = req.params.id;
    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/:ids', async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.get('/category/:category', async (req, res, next) => {
    const category = req.params.category;

    try {
      const { data } = await service.GetProductsByCategory(category);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put('/wishlist', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError('Invalid Product Id');
      }
      const product = await service.GetProductById(req.body._id);
      const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishlist);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/wishlist/:id', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    try {
      if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError('Invalid Product Id');
      }
      const product = await service.GetProductById(productId);
      if (!product) {
        throw new BadRequestError('Product not found');
      }
      const wishlist = await customerService.RemoveFromWishlist(_id, productId);
      return res.status(200).json(wishlist);
    } catch (err) {
      next(err);
    }
  });

  app.put('/cart', UserAuth, async (req, res, next) => {
    const { _id, qty } = req.body;

    try {
      const product = await service.GetProductById(_id);
      if (!product) {
        throw new BadRequestError('Product not found', 400);
      }
      const result = await customerService.ManageCart(
        req.user._id,
        product,
        qty,
        false
      );
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/cart/:id', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await service.GetProductById(req.params.id);
      const result = await customerService.ManageCart(_id, product, 0, true);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get('/', async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
