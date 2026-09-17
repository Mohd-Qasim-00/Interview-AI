const mongoose = require("mongoose");

const config=require('./config');

async function connectDB() {
  await mongoose.connect(config.mongoURI);
  console.log('Connected to MongoDB');
}


module.exports =connectDB;
