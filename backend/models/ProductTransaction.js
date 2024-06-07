// models/ProductTransaction.js
const mongoose = require("mongoose");

const productTransactionSchema = new mongoose.Schema({
  "id": "Number",
  "title": "String",
  "description": "String",
  "price": "Number",
  "dateOfSale": "Date",
  "sold": "Boolean",
  "category": "String"
});

const ProductTransaction = mongoose.model(
  "ProductTransaction",
  productTransactionSchema
);

module.exports = ProductTransaction;
