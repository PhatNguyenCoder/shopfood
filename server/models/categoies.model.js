const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  categoryId: { type: Number },
  categoryName: { type: String },
  active: { type: Number },
});
module.exports = mongoose.model("Categories", categorySchema);
