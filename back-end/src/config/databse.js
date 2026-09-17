const mongoose = require("mongoose");

const config=require('./config');

let connectionPromise;

async function connectDB() {
  if (!config.mongoURI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.mongoURI)
      .then(() => {
        console.log('Connected to MongoDB');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}


module.exports =connectDB;
