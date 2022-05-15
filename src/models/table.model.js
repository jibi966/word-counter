const mongoose = require("mongoose");

const urlScheme = new mongoose.Schema(
  {
    url: { type: String, required: true },
    count: { type: Number, required: true },
    images: [{ type: String }],
    links: [{ type: String }],
    favorite: { type: String, default: "No" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("url", urlScheme);
