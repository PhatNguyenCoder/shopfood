const Cart = require("../models/cart.model");

exports.getCart = async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.postCart = async (req, res) => {
  const { productName, price, quantity, money, id_user, id_product, image } =
    req.body;
  const newCart = new Cart({
    productName,
    image,
    price,
    quantity,
    money,
    id_user,
    id_product,
  });

  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCartByUser = async (req, res) => {
  const id_user = req.params.id_user;
  try {
    const cartByUser = await Cart.find({ id_user: id_user });
    res.status(200).json(cartByUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const deleteCart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart delete successfully", deleteCart });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: quantity },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).send(error);
  }
};
