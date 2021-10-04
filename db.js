const mongoose = require("mongoose");
const config = require("./config");

function initializeDB() {
  // DB Config
  const db = `${config.MONGO_URI}`;
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
