const dotenv = require('dotenv');
dotenv.config();

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || process.env.jwtSecret || "defaultSecretKey",
  port: process.env.PORT || 3000,
};

module.exports = config;
