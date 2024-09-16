const Product = require("../models/product.model");

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.postProduct = async (req, res) => {
  const {
    productName,
    price,
    description,
    ingredient,
    energy,
    hot,
    starRating,
    id_category,
    active,
  } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const newProduct = new Product({
    productName,
    price,
    image,
    description,
    ingredient,
    energy,
    hot,
    starRating,
    id_category,
    active,
  });
  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getHotProduct = async (req, res) => {
  try {
    const hotProduct = await Product.find({ hot: 1 });
    res.status(200).json(hotProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const id = req.params.id_category;
    const products = await Product.find({ id_category: id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Product delete successfully", deleteProduct });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updateProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};
