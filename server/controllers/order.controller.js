const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

exports.getOrder = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.postOrder = async (req, res) => {
  const {
    userId,
    items,
    email,
    phone,
    address,
    totalAmount,
    active = 0,
  } = req.body;
  const code = "#" + Math.floor(100000 + Math.random() * 900000).toString();

  const newOrder = new Order({
    userId,
    items,
    email,
    phone,
    address,
    totalAmount,
    active,
    code,
  });
  try {
    const saveOrder = await newOrder.save();
    await Cart.deleteMany({ id_user: userId });
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateStatus = async (req, res) => {
  const { active } = req.body;
  try {
    const updateStatus = await Order.findByIdAndUpdate(
      req.params.id,
      { active: active },
      { new: true }
    );
    res.status(200).json(updateStatus);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  try {
    const orderById = await Order.findById(orderId);
    res.status(200).json(orderById);
  } catch (error) {
    res.status(500).send(error);
  }
};
