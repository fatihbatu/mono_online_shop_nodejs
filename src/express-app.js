const express = require('express');
const cors = require('cors');
const { customer, products, shopping } = require('./api');
const ErrorHandler = require('./utils/error-handler');

module.exports = async (app) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(__dirname + '/public'));

  //api
  customer(app);
  products(app);
  shopping(app);

  // error handling
  app.use(ErrorHandler);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    res.status(404).send({ message: 'Not Found' });
  });
};
