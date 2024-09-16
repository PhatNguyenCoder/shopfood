const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  productName: { type: String },
  image: { type: String },
  price: { type: String },
  quantity: { type: Number },
  money: { type: Number },
  id_user: { type: String },
  id_product: { type: String },
});

module.exports = mongoose.model("Cart", cartSchema);
