import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Category } = models;

async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(generalizeMongooseDocument(categories));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addCategory(req, res) {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeCategory(req, res) {
  try {
    const result = await Category.deleteOne({ _id: req.params.categoryId });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({});
  }
}

export default { getCategories, addCategory, removeCategory };
