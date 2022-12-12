import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
  products: { type: [Schema.Types.ObjectId], ref: "Product" },
});

const model = mongoose.model("Wishlist", wishListSchema);
export default model;
