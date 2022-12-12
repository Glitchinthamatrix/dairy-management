import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: [true, "Name is required"]},
  email:{type: String, required: [true, "Email is required"], unique:[true, "This email is already taken"], lowercase: true, match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "This email is invalid"]},
  password: {type: String, required: [true, "Password is required"]},
  isASeller: {type: Boolean, default: false},
  shippingAddress: {type: String},
  cart: {type: Schema.Types.ObjectId, ref: "Cart"},
  wishlist: {type: Schema.Types.ObjectId},
  isAnAdmin: {type: Boolean, default: false},
  affiliateBrands: {type: [Schema.Types.ObjectId], ref: "Brand"},
  sellerProducts: {type: [Schema.Types.ObjectId], ref: "Product"}
})

const model = mongoose.model("User", userSchema);
export default model; 
