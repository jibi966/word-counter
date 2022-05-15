const mongoose = require("mongoose");

module.exports = () => {
  return mongoose
    .connect(
      "mongodb+srv://Jibin:Jibi@cluster0.c4lkd.mongodb.net/wordCount?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("MongoDB connected");
    });
};
