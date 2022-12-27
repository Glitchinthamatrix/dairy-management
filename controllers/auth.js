import models from "../models/_models.js";
// importing session-controller directly to avoid circular dependency
// auth-controller is being imported in _controllers.js
import { generalizeMongooseDocument } from "../libs/mongoose.js";
import sessionController from "./session.js";
const { Cart, User, Wishlist } = models;

async function signUp(req, res) {
  try{
    const { name, email, password, shippingAddress, isASeller} = req.body;
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.isASeller = isASeller;
    if(!isASeller){
      user.shippingAddress = shippingAddress;
      const cart = await Cart.create({user: user._id});
      const wishlist = await Wishlist.create({user: user._id});
      user.cart = cart._id;
      user.wishlist = wishlist._id;
      user = await user.save();
    }
    res.status(200).json(generalizeMongooseDocument(user));
  }catch(e){
    res.status(500).json({});
  }
}

async function getUser(req, res, next) {
  const token = req.headers["authorization"];
  const user = await sessionController.getSession(token);
  res.locals.user = user;
  next();
}

async function verifyUserAndPassAsResponseLocal(req, res, next) {
  let isAuthenticated = false;
  const token = req.headers["authorization"];

  if (token) {
    const session = await sessionController.getSession(token);
    if (session) {
      res.locals.user = session.user;
      isAuthenticated = true;
    }
  }

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).json({});
  }
}

async function verifyUserAndPassAsRequestLocal(req, res, next) {
  let isAuthenticated = false;
  const token = req.headers["authorization"];

  if (token) {
    const session = await sessionController.getSession(token);
    req.locals.user = session.user;
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).json({});
  }
}

async function verifyAdminFromResponseLocals(req, res, next) {
  const user = res.locals.user;
  if (user && user.isAnAdmin) {
    next();
  } else {
    res.status(401).json({});
  }
}

async function verifySellerFromResponseLocals(req, res, next) {
  const user = res.locals.user;
  if (user && user.isASeller) {
    next();
  } else {
    res.status(401).json({});
  }
}

async function verifyCustomerFromResponseLocals(req, res, next) {
  const user = res.locals.user;
  if (user && !user.isAnAdmin && !user.isASeller) {
    next();
  } else {
    res.status(401).json({});
  }
}

export default {
  signUp,
  getUser,
  verifyUserAndPassAsRequestLocal,
  verifyUserAndPassAsResponseLocal,
  verifyAdminFromResponseLocals,
  verifySellerFromResponseLocals,
  verifyCustomerFromResponseLocals,
};
