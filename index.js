const express = require("express");
const cors = require("cors");
const connect = require("./src/configs/db");
const tableController = require("./src/controllers/table.controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", tableController);

app.listen(3030, async () => {
  try {
    await connect();
    console.log("Listening on port 3030");
  } catch (error) {
    console.log(error);
  }
});
