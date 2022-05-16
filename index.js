const express = require("express");
const cors = require("cors");
const connect = require("./src/configs/db");
const tableController = require("./src/controllers/table.controller");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", tableController);

app.listen(process.env.PORT || 3001, async () => {
  try {
    await connect();
    console.log("Listening on port 3030");
  } catch (error) {
    console.log(error);
  }
});
