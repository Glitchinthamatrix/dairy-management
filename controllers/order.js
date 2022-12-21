import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Order, User } = models;

async function getOrders(req, res) {
  try {
    const orders = await Order.find();
    res.status(200).json(generalizeMongooseDocument(orders));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addOrder(req, res, next) {
  try {
    const { deliveryAddress, product } = req.body;
    const date = new Date();
    const deliveryDate = new Date(date.getTime() + 12 * 3600000);
    const order = await Order.create({
      user: res.locals.user.id,
      product: product,
      deliveryAddress: deliveryAddress,
      deliveryDate: deliveryDate,
    });
    const user = await User.findOne({_id: res.locals.user.id});
    user.orders.push(order._id);
    await user.save();
    res.status(200).json(generalizeMongooseDocument(order));
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

async function getOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    res.status(200).json(generalizeMongooseDocument(order));
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateOrder(req, res) {
  try {
    const updated = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

export default { getOrders, addOrder, getOrder, updateOrder };
