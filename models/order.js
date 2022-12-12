import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: {type: [Schema.Types.ObjectId], ref: "Product"},
  user: {type: Schema.Types.ObjectId, ref: "User"},
})

const model = mongoose.model("Order", orderSchema);
export default model;
