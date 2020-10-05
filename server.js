//TODO: edit .env file and add it to .gitignore file
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
