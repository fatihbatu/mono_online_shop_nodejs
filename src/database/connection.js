const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
  } catch (err) {
    console.log('====================================');
    console.log('Error connecting to database: ', err.message);
    console.log('====================================');
    process.exit(1);
  }
};
