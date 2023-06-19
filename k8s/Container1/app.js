// Code for express.js functions is refered from : https://expressjs.com/en/api.html
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "/path/to/persistent/volume" });

app.use(express.json());

app.post("/store-file", upload.single("file"), (req, res) => {
  if (!req.file || !req.body.data) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  const filename = req.file.filename;
  const data = req.body.data;

  if (!filename) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  const fileContent = `product, amount\n${data}`;

  fs.writeFile(
    path.join(req.file.destination, filename),
    fileContent,
    (err) => {
      if (err) {
        return res.status(500).json({
          file: filename,
          error: "Error while storing the file to the storage.",
        });
      }

      return res.json({ file: filename, message: "Success." });
    }
  );
});

app.post("/calculate", (req, res) => {
  if (!req.body.file || !req.body.product) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  const filename = req.body.file;
  const product = req.body.product;

  if (!filename) {
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  const filePath = path.join("/path/to/persistent/volume", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ file: filename, error: "File not found." });
  }

  fs.readFile(filePath, "utf8", (err, fileContent) => {
    if (err) {
      return res
        .status(400)
        .json({ file: filename, error: "Input file not in CSV format." });
    }

    try {
      const total = calculateProductTotal(fileContent, product);
      return res.json({ file: filename, sum: total.toString() });
    } catch (err) {
      return res
        .status(400)
        .json({ file: filename, error: "Input file not in CSV format." });
    }
  });
});

function calculateProductTotal(fileContent, product) {
  let total = 0;

  const lines = fileContent.split("\n");
  for (let i = 1; i < lines.length; i++) {
    const [prod, amount] = lines[i].split(",");
    if (prod.trim() === product) {
      total += parseInt(amount.trim());
    }
  }

  return total;
}

app.listen(5001, () => {
  console.log("Container 2 is running on port 5001");
});
