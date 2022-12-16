import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
import { filterObject } from "../utils/object.js";
const { Review } = models;

const mapReviewAuthorValues = {
  id: "id",
  name: "name",
}

async function getReview(req, res) {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId });
    res.status(200).json(generalizeMongooseDocument(review));
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateReview(req, res) {
  try {
    let updated = await Review.findOneAndUpdate(
      { _id: req.params.reviewId },
      { $set: {comment: req.body.comment} },
      { new: true }
    ).populate(["author"]);
    updated = generalizeMongooseDocument(updated);
    updated.author = filterObject(updated.author, mapReviewAuthorValues);
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

export default { getReview, updateReview, removeReview };
