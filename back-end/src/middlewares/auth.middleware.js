const jwt=require('jsonwebtoken');
require('dotenv').config();
const config=require('../config/config');

const tokenBlacklist=require('../module/blacklist.module');
const connectDB=require('../config/databse');


const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  await connectDB();
  
const blacklistedToken = await tokenBlacklist.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
  }



  try {
const decoded = jwt.verify(token, config.jwtSecret);

req.user = decoded; // Attach the decoded user information to the request object
next(); // Proceed to the next middleware or route handler
 
  
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }


}

module.exports = { authenticateToken };
