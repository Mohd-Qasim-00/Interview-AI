const multer=require("multer");


const upload=multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize:3*1024*1024 // 3mb
  },
  fileFilter(req, file, callback) {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
  },
})

module.exports=upload;
