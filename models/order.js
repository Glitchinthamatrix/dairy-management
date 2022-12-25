import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: ["User is required"] },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Seller is required"] },
  isDelivered: { type: Boolean, default: false },
  isCancelled: { type: Boolean, default: false },
  transaction: { type: Schema.Types.ObjectId, ref: "Transaction", default: null },
  orderDate: { type: Date, required: [true, "Order date is requred"] },
  deliveryDate: { type: Date, required: [true, "Delivery date is required"] },
  deliveryAddress: { type: String, required: [true, "Delivery address is required"] },
});

const model = mongoose.model("Order", orderSchema);
export default model;
