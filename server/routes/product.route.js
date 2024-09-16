const express = require("express");
const productController = require("../controllers/product.controller");
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

router.get("/product", productController.getProduct);
router.post("/product", upload.single("image"), productController.postProduct);
router.get("/product/hot", productController.getHotProduct);
router.get("/product/:id", productController.getProductById);
router.get(
  "/product/cate/:id_category",
  productController.getProductByCategory
);
router.delete("/product/:id", productController.deleteProduct);
router.put(
  "/product/:id",
  upload.single("image"),
  productController.updateProduct
);

module.exports = router;
