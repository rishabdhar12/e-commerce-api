const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.URL, {
    dbName: `e-commerce`,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(`Couldn't connect to DB ${e}`);
    process.exit();
  });
