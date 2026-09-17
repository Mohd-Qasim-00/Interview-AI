const mongoose=require('mongoose');


const blacklistSchema=new mongoose.Schema({
  token:{
    type:String,
    require:[true,"Token is required"],
  }
},
{
  timeseries: true,
});


const tokenBlacklist = mongoose.model('TokenBlacklist', blacklistSchema);
module.exports = tokenBlacklist;