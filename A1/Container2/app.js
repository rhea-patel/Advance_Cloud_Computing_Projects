// Code for express.js functions is refered from : https://expressjs.com/en/api.html
const express = require("express");
const fs = require("fs");
const fast_csv = require("fast-csv");
const application = express();
const PORT = 5000;

application.use(express.json());

application.post("/", (req, res) => {
  const file = req.body.file;
  const product = req.body.product;
  let sum = 0;
  let invalid_csv = false;
  // Code for parser is reffered from https://c2fo.github.io/fast-csv/docs/introduction/example
  fs.createReadStream("../mountedVolume/" + file)
    .pipe(fast_csv.parse({ headers: true }))
    .on("error", (error) => {
      return res.json({
        file: file,
        error: "Input file not in CSV format.",
      });
    })
    .on("data", (row) => {
      if (
        !(
          Object.keys(row).includes("product") &&
          Object.keys(row).includes("amount")
        )
      ) {
        invalid_csv = true;
      } else if (row.product === product) {
        sum += parseInt(row.amount);
      }
    })
    .on("end", () => {
      if (invalid_csv) {
        return res.json({
          file: file,
          error: "Input file not in CSV format.",
        });
      }
      return res.json({
        file: file,
        sum,
      });
    });
});

application.listen(PORT, () =>
  console.log(`Application Runnning on PORT:${PORT}`)
);
