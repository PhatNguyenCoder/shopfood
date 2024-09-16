const Category = require("../models/categoies.model");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.postCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCategoryId = async (req, res) => {
  try {
    const id = await Category.findById(req.params.id);
    res.status(200).json(id);
  } catch (error) {
    res.status(500).json({ error: error.mesage });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Category delete successfully", deleteCategory });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Category updated successfully", updateCategory });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
