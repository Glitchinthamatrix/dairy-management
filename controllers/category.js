import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Category } = models;

function getCategories(_, res) {
  Category.find()
    .then((categories) => {
      res.status(200).json(generalizeResult(categories));
    })
    .catch((e) => {
      res.status(500).json({});
    });
}

function addCategory(req, res) {
  Category.create({ name: req.body.name })
    .then((category) => {
      res.status(200).json(generalizeResult(category));
    })
    .catch((_) => {
      res.status(500)({});
    });
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
