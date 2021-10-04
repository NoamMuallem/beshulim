const express = require("express");
const path = require("path");
const api = require("./routes/api");
const initializeDB = require("./db.js");
require("dotenv").config();

initializeDB();

const app = express();
app.use("/api", api);

// Serve static react assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  //if no route was hit up until now, serve the static files from build folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
