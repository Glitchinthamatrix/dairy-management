import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: { type: [Schema.Types.ObjectId], ref: "Product" },
  user: { type: Schema.Types.ObjectId, ref: "User", required: ["User is required"] },
  isDelivered: { type: Boolean, default: false },
  transaction: { type: Schema.Types.ObjectId, default: null },
  deliveryDate: { type: Date, required: [true, "Delivery date is required"] },
  deliveryAddress: { type: String, required: [true, "Delivery address is required"] },
});

const model = mongoose.model("Order", orderSchema);
export default model;
