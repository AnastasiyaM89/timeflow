const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories: categories.map((cat) => cat.name) });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res
        .status(409)
        .json({ message: `Category "${name.trim()}" already exists` });
    }

    const newCategory = new Category({ name: name.trim() });
    const savedCategory = await newCategory.save();
    res.status(201).json({ name: savedCategory.name });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
});

router.delete("/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  const trimmedCategoryName = categoryName.trim();

  if (!trimmedCategoryName) {
    return res
      .status(400)
      .json({ message: "Category name is required for deletion" });
  }

  try {
    const defaultCategories = ["Работа", "Личное", "Общая"];
    if (defaultCategories.includes(trimmedCategoryName)) {
      return res.status(400).json({
        message: `Cannot delete default category "${trimmedCategoryName}".`,
      });
    }

    const result = await Category.deleteOne({ name: trimmedCategoryName });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `Category "${trimmedCategoryName}" not found.` });
    }

    res.status(200).json({
      message: `Category "${trimmedCategoryName}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
});

module.exports = router;
