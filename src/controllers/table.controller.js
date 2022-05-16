const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");
const { convert } = require("html-to-text");
const cheerio = require("cheerio");
const validUrl = require("valid-url");
const Url = require("../models/table.model");

router.get("", async (req, res) => {
  try {
    const allData = await Url.find().lean().exec();
    res.send(allData);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const url = req.body.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Getting other external links
    const linkObjects = $("a");
    const links = [];

    linkObjects.each((index, element) => {
      const url = $(element).attr("href");
      // Checking if the url is valid
      if (validUrl.isUri(url)) {
        links.push(url);
      }
    });

    // Getting external image links
    const imageObjects = $("img");
    const images = [];

    imageObjects.each((index, element) => {
      const url = $(element).attr("src");
      // Checking if the image url is valid
      if (
        url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !==
        null
      ) {
        images.push(url);
      }
    });

    // getting the words count
    const text = convert(data, { wordwrap: 130 });
    const alphabet = text.replace(/[^A-Za-z']+/g, " ").trim();
    const lowerCase = alphabet.toLowerCase();
    const textArray = lowerCase.split(" ");
    const count = textArray.length;

    // Check if the url is already present in the database

    const check = await Url.findOne({ url: req.body.url });
    if (check) {
      return res.status(404).send({ message: "Already available" });
    }

    // Adding to database if not available
    const savedData = await Url.create({
      url,
      count,
      images,
      links,
    });
    return res.send(savedData);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const data = await Url.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const deletedData = await Url.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: "Deleted", deletedData });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
