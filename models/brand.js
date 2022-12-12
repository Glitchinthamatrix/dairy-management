import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: {type: String, required: [true, "Brand Name is required"]},
  email: {type: String, required: [true, "Brand Email is required"]},
  addedBy: {type: Schema.Types.ObjectId, ref: "User"}
});

const model = mongoose.model("Brand", brandSchema);
export default model;
