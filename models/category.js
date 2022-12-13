import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: [true, "Category Name is required"] },
});

const model = mongoose.model("Category", categorySchema);
export default model;
