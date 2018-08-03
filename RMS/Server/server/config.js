var constants = require('./../Constants/Constants.js');

module.exports = {
      databaseURL: process.env.DATABASE_URL || constants.DATABASE_URL,
      secret: constants.SECRET_VALUE
};