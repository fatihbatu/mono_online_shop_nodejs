const { ValidateSignature } = require('../../utils');

module.exports = async (req, res, next) => {
  const isAuthorized = await ValidateSignature(req);

  if (isAuthorized) {
    next();
  }
  return res.status(403).json({ message: 'Unauthorized' });
};
