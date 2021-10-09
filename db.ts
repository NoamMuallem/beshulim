import mongoose from "mongoose";
import config from "./config";

function initializeDB() {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  } as Parameters<typeof mongoose.connect>[1];

  // DB Config
  const db = `${config.MONGO_URI}`;
  // Connect to Mongo
  mongoose
    .connect(db, options)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err: Error) => console.log(err));
}

export default initializeDB;
