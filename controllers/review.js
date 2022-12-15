import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Review } = models;

async function addReview(req, res) {
  try {
    const review = await Review.create(req.body);
    res.status(200).json(generalizeMongooseDocument(review));
  } catch (e) {
    res.status(500).json({});
  }
}

async function getReview(req, res) {
  try {
    const review = Review.findOne({ _id: req.params.reviewId });
    res.sttaus(200).json(generalizeMongooseDocument(review));
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateReview(req, res) {
  try {
    const updated = await Review.findOneAndUpdate(
      { _id: req.params.reviewId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeReview(req, res) {
  try {
    const result = await Review.deleteOne({ id: req.params.reviewId });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({});
  }
}

export default { addReview, getReview, updateReview, removeReview };
