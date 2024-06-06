
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sold: {
    type: Boolean,
    required: true,
    default: false,
  },
  dateOfSale: {
    type: Date,
    default: null,
  },
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Product.insertMany(response.data);
    res.status(200).send("Database initialized");
  } catch (error) {
    res.status(500).send("Error initializing database");
  }
});

mongoose.connect("mongodb://localhost:27017/transactions", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(3030, () => console.log("Server started on port 3030"));
