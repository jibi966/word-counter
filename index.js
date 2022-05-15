const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { convert } = require("html-to-text");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.send("It's working!");
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const url = req.body.url;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const linkObjects = $("a");
    const links = [];

    linkObjects.each((index, element) => {
      links.push($(element).attr("href"));
    });

    const imageObjects = $("img");
    const images = [];

    imageObjects.each((index, element) => {
      images.push($(element).attr("src"));
    });

    return res.send(images);

    // const text = convert(data, { wordwrap: 130 });
    // const alphabet = text.replace(/[^A-Za-z']+/g, " ").trim();
    // const lowerCase = alphabet.toLowerCase();
    // let count = 0;
    // for (let i = 0; i < lowerCase.length; i++) {
    //   count++;
    // }
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(3030, () => {
  console.log("Listening on port 3030");
});
