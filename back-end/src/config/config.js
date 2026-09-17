const dotenv=require('dotenv');
dotenv.config();

if(!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables");
  process.exit(1);
}

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.jwtSecret || "defaultSecretKey", // Provide a default value for jwtSecret
  port: process.env.PORT || 3000, // Provide a default value for PORT
};

module.exports=config;