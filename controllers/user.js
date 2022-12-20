import sessionController from "../controllers/session.js";
import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Cart, User, Wishlist } = models;

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(generalizeMongooseDocument(users));
  } catch (e) {
    res.status(500).json({});
  }
}

async function addUser(req, res) {
  let cart;
  let wishlist;
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(422).json({ message: "A user with these credentials already exists" });
      return;
    }
    let user = await User.create(req.body);
    cart = await Cart.create({ user: user.id });
    wishlist = await Wishlist.create({ user: user.id });
    user.cart = cart.id;
    user.wishlist = wishlist.id;
    user = await user.save();
    res.status(200).json(generalizeMongooseDocument(user));
  } catch (e) {
    if (cart !== undefined) {
      await Cart.deleteOne({ id: cart.id });
    }
    if (wishlist !== undefined) {
      await Wishlist.deleteOne({ id: wishlist.id });
    }
    if (e.name === "ValidationError") {
      res.status(422).json(e);
    } else {
      res.status(500).json({});
    }
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.status(200).json(generalizeMongooseDocument(user));
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateUser(req, res) {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeUser(req, res) {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({});
  }
}

async function getSelf(req, res) {
  try {
    const token = req.headers["authorization"];
    const session = await sessionController.getSession(token);
    res.status(200).json(session.user);
  } catch (e) {
    res.status(500).json({});
  }
}

export default {
  getUsers,
  addUser,
  getUser,
  updateUser,
  removeUser,
  getSelf,
};
