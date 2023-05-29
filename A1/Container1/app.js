// Code for express.js functions is refered from : https://expressjs.com/en/api.html
const express = require("express");
const fs = require("fs");
const axios = require("axios");
const application = express();
const PORT = 6000;

application.use(express.json());

application.post("/calculate", (req, res) => {
  const file = req.body.file;
  const product = req.body.product;
  if (!file) {
    return res.json({
      file: null,
      error: "Invalid JSON input.",
    });
  }
  const file_location = "../mountedVolume/" + file;

  try {
    // Code to check file exist is reffered from: https://www.geeksforgeeks.org/node-js-fs-existssync-method/
    if (fs.existsSync(file_location)) {
      axios
        .post("http://container2:5000/", { file, product })
        .then(({ data }) => {
          return res.json(data);
        })
        .catch(() => {
          console.log("ERROR");
        });
    } else {
      return res.json({
        file: file,
        error: "File not found.",
      });
    }
  } catch (err) {
    res.json({
      file: file,
      error: "File not found.",
    });
  }
});

application.listen(PORT, () =>
  console.log(`Application Runnning on PORT:${PORT}`)
);
