const mongoose = require("mongoose");
require("dotenv").config();

function initializeDB() {
  // DB Config
  const db = `${process.env.MONGO_URI}`;
  // Connect to Mongo
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }) // Adding new mongo url parser
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
}

module.exports = initializeDB;
