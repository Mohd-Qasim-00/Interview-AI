const dotenv= require('dotenv').config();

const app =require('./src/app');

const generateInterviewReport=require('./src/services/ai.service');

const dns=require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB=require('./src/config/databse')
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});