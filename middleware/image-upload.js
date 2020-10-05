const multer = require("multer");

//setting up the upload behavior
const upload = multer({
  limits: {
    //restricting the upload size
    fileSize: 2000000, //in byte
  },
  fileFilter(req, file, cb) {
    if (!file.originalName.match(/\.(png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true); //valid upload
  },
});

module.exports = upload;
