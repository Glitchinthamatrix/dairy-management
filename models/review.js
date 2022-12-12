import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref:"User", required:[true, "Author is required"]},
  comment: {type: String, required: [true, "Review comment is required"]}
})

const model = mongoose.model("Review", reviewSchema);
export default model;
