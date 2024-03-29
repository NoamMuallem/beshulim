//for autocompletion
require("dotenv").config();

const config = {
  production: process.env.NODE_ENV === "production",
  TOKKEN_SECRET: process.env.TOKKEN_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PORT: process.env.PORT,
};

export default config;
