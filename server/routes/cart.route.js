const express = require("express");
const cartController = require("../controllers/cart.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/cart", cartController.getCart);
router.post("/cart", cartController.postCart);
router.get("/cart/:id_user", cartController.getCartByUser);
router.delete("/cart/:id", cartController.deleteCart);
router.put("/cart/:id", cartController.updateCartQuantity);

module.exports = router;
