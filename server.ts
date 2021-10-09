//TODO: edit .env file and add it to .gitignore file
import app from "./app";
import config from "./config";

app.listen(config.PORT, () =>
  console.log(`Server started on PORT ${config.PORT}`)
);
