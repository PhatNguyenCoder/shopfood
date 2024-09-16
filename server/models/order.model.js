const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: String },
      image: { type: String },
      productName: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  userId: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  totalAmount: { type: String },
  active: { type: Number },
  code: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
