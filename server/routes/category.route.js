const express = require("express");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.postCategory);
router.get("/categories/:id", categoryController.getCategoryId);
router.delete("/categories/:id", categoryController.deleteCategory);
router.put("/categories/:id", categoryController.updateCategory);
module.exports = router;
