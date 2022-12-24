import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Product, Order, User } = models;

async function getOrders(req, res, next) {
  try {
    let orders = [];
    if (res.locals.user.isAnAdmin) {
      orders = await Order.find().populate(["product"]);
    } else if (res.locals.user.isASeller) {
      orders = await Order.find({ seller: res.locals.user.id }).populate(["product"]);
    } else {
      orders = await Order.find({ buyer: res.locals.user.id }).populate(["product"]);
    }
    res.status(200).json(generalizeMongooseDocument(orders));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addOrder(req, res, next) {
  try {
    const { deliveryAddress, product } = req.body;
    const date = new Date();
    const deliveryDate = new Date(date.getTime() + 24 * 3600000);
    const orderedProduct = await Product.findOne({ _id: product });
    const buyer = await User.findOne({ _id: res.locals.user.id });
    const seller = await User.findOne({ _id: orderedProduct.addedBy });
    const order = await Order.create({
      buyer: res.locals.user.id,
      seller: orderedProduct.addedBy,
      product: product,
      deliveryAddress: deliveryAddress,
      orderDate: new Date(),
      deliveryDate: deliveryDate,
    });
    buyer.orders.push(order._id);
    seller.orders.push(order._id);
    await buyer.save();
    await seller.save();
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
