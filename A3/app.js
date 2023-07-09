const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const mysql = require("mysql2/promise");

const app = express();
app.use(bodyParser.json());

// AWS configuration
AWS.config.update({
  accessKeyId: "ASIA3WL3REVDHQ7ZVSFE",
  secretAccessKey: "fqmhO6uT+EktedSornpMA5NMlUSHFDWDcdR4YEah",
  sessionToken:
    "FwoGZXIvYXdzECgaDDZ9RqWl/bVchQ4QSyK7AaSZwecfEiZ7KZkJdQB+MYsYkmpgsSFYvqu2ioSXkq6VUzHrIHeF7qUxQaQmC/h2cLPzeHqORuFUYBRCYa9S4QT3ssW+vYOEsIim6IJEiKpLGQqrfmZ5CT7WLpsodfJpeIllOj1K+pgs/VzZhyIwSLd9/G+daljGMQyMytcP+Ke2k93x4TD2S3WVaxC9fwWoegSlypJwHZoEKBn4Gea4OdNzEArnD4gesGGcS6UjrGw68ZRJqNl9kn/i6oEozJirpQYyLcMDJLDBR7kpTA1fgQMZE676UAjLwcfsStPwwkT+fUZOO8e3Fd3nPdVQrlwAZQ==",
  region: "us-east-1",
});

// MySQL configuration
const dbConfig = {
  host: "riyap-instance-1.ckvhg0mqgsuv.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "csci",
};

// Connect to the RDS database
let connection;

async function connectToDatabase() {
  connection = await mysql.createConnection(dbConfig);
  console.log("Connected to the database");
}

connectToDatabase();

// POST /store-products endpoint
app.post("/store-products", async (req, res) => {
  try {
    const { products } = req.body;

    for (const product of products) {
      const { name, price, availability } = product;

      // Insert product into the database
      await connection.execute(
        "INSERT INTO products (name, price, availability) VALUES (?, ?, ?)",
        [name, price, availability]
      );
    }

    return res.json({ message: "Success." });
  } catch (error) {
    console.error("Error storing products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /list-products endpoint
app.get("/list-products", async (req, res) => {
  try {
    // Retrieve products from the database
    const [rows] = await connection.execute("SELECT * FROM products");

    const products = rows.map((row) => ({
      name: row.name,
      price: row.price,
      availability: row.availability,
    }));

    return res.json({ products });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
