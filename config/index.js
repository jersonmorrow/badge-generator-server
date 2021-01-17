require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 5000,
  authJwtSecret: process.env.JWT_TOKEN,
  dbConnection: process.env.MONGODB_CONNECTION_STRING,
  clientUrl: process.env.CLIENT_URL,
};

module.exports = { config };
