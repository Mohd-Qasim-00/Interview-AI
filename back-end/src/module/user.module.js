const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  username:{
    type:String,
    unique:[true,"username alreaddy taken"],
    require:true,
  },
  
  email:{
  type:String,
  unique:[true,"email laready regesterd"],
  require:true,
  },

  password:{
        type:String,
      require:true,

  }

})

const User = mongoose.model('User', userSchema);
module.exports = User;