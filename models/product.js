import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: {type: String},
  description: {type:String, default: null},
  brand: {type: Schema.Types.ObjectId, ref: "Brand"},
  price:{type: Number},
  category: {type: Schema.Types.ObjectId, ref: "Category", default: "6392fb2765a307bdd2e62c7f"},
  unitsAvailable: {type: Number, default: Number.MAX_SAFE_INTEGER},
  images: {type: [String], caste: false,},
  reviews: {type: [Schema.Types.ObjectId], ref: "Review"},
  addedBy: {type: Schema.Types.ObjectId, ref: "User" }
})

const model = mongoose.model("Product", productSchema);
export default model;
