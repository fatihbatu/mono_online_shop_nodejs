const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
  } catch (error) {
    console.log('====================================');
    console.log('Error connecting to database: ', error.message);
    console.log('====================================');
    process.exit(1);
  }
};
