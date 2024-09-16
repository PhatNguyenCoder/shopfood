const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  productName: { type: String },
  price: { type: String },
  image: { type: String },
  description: { type: String },
  ingredient: { type: String },
  energy: { type: String },
  hot: { type: Number },
  starRating: { type: Number },
  id_category: { type: Number },
  active: { type: Number },
});
module.exports = mongoose.model("Product", productSchema);
