const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { APP_SECRET } = require('../config');

module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    const payload = jwt.verify(signature.split(' ')[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error('No data found');
  }
};
