const ProductService = require('../services/product-service');
const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');

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
    } catch (error) {
      next(error);
    }
  });

  app.get('/:id', async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post('/:ids', async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  });

  app.put('/wishlist', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await service.GetProductById(req.body._id);
      const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishlist);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/wishlist', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const product = await service.GetProductById(productId);
      const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishlist);
    } catch (error) {
      next(error);
    }
  });

  app.put('/cart', UserAuth, async (req, res, next) => {
    const { _id, qty } = req.body;

    try {
      const product = await service.GetProductById(_id);
      const result = await customerService.ManageCart(
        req.user._id,
        product,
        qty,
        false
      );
      return res.ststus(200).json(result);
    } catch (error) {
      next(err);
    }
  });

  app.delete('/cart/:id', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await service.GetProductById(req.params.id);
      const result = await customerService.ManageCart(_id, product, 0, true);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/', async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
