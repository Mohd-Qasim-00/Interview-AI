const multer=require("multer");


const upload=multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize:3*10124*1024 // 3mb
  }
})

module.exports=upload;