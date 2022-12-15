import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Order } = models;

async function getOrders(req, res) {
  try {
    const orders = await Order.find();
    res.status(200).json(generalizeMongooseDocument(orders));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addOrder(req, res) {
  try {
    const order = await Order.create(req.body);
    res.status(200).json(generalizeMongooseDocument(order));
  } catch (e) {
    res.status(500).json({});
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
