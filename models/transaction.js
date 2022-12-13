import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
  amount: { type: Number, required: [true, "Amount is required"] },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: [true, "Order is required"] },
});

const model = mongoose.model("Transaction", transactionSchema);
export default model;
