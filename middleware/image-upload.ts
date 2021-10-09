import multer from "multer";

//setting up the upload behavior
const upload = multer({
  limits: {
    //restricting the upload size
    fileSize: 2000000, //in byte
  },
  fileFilter(_: any, file, cb: Function) {
    if (!file.originalname.match(/\.(png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true); //valid upload
  },
});

export default upload;
