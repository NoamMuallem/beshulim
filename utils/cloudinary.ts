import config from "../config";
const cloudinary = require("cloudinary").v2;

const conf = {
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
} as Parameters<typeof cloudinary.config>[0];

cloudinary.config(conf);

export default cloudinary;
