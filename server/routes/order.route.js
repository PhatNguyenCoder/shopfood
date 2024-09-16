const express = require("express");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.get("/order", orderController.getOrder);
router.post("/order", orderController.postOrder);
router.put("/order/:id", orderController.updateStatus);
router.get("/order/:id", orderController.getOrderById);

module.exports = router;
