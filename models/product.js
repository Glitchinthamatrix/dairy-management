import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: [true, "Title is required"] },
  description: { type: String, default: null },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", default: null },
  price: { type: Number, required: [true, "Price is required"] },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  unitsAvailable: { type: Number, default: Number.MAX_SAFE_INTEGER },
  images: { type: [String] },
  reviews: { type: [Schema.Types.ObjectId], ref: "Review" },
  addedBy: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Seller is required"] },
});

const model = mongoose.model("Product", productSchema);
export default model;
