import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Cart } = models;

async function getCarts(req, res) {
  try {
    const carts = await Cart.find();
    res.status(200).json(generalizeMongooseDocument(carts));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addCart(req, res) {
  try {
    const cart = await Cart.create(req.body);
    if (cart.user.toString() !== res.locals.user.id) {
      res.status(401).json({});
      return;
    }
    res.status(200).json(generalizeMongooseDocument(cart));
  } catch (e) {
    res.status(500).json({});
  }
}

async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId }).populate(["products"]);
    res.status(200).json(generalizeMongooseDocument(cart));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addProductToCart(req, res) {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findOne({ _id: cartId });
    if (cart.user.toString() !== res.locals.user.id) {
      res.status(401).json({});
      return;
    }
    const updated = await Cart.findOneAndUpdate(
      { _id: req.params.cartId },
      { $set: { products: [...cart.products, req.body.product] } },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeProductFromCart(req, res) {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findOne({ _id: cartId });
    if (cart.user.toString() !== res.locals.user.id) {
      res.status(401).json({});
      return;
    }
    const products = cart.products.filter(
      (product) => product.toString() !== req.body.product
    );
    const updated = await Cart.findOneAndUpdate(
      { _id: req.params.cartId },
      { $set: { products: products } },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

export default { getCarts, addCart, getCart, addProductToCart, removeProductFromCart };
