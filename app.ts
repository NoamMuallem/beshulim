import express from "express";
import path from "path";
import api from "./routes/api";
import initializeDB from "./db.js";
import config from "./config";

initializeDB();

const app = express();
app.use("/api", api);

// Serve static react assets if in production
if (config.production) {
  // Set static folder
  app.use(express.static("client/build"));

  //if no route was hit up until now, serve the static files from build folder
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

export default app;
