import sessionController from "../controllers/session.js";
import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Cart, User, Wishlist } = models;

function getUsers(req, res){
  User.find()
  .then((users)=>{
    res.status(200).json(generalizeResult(users));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

async function addUser(req, res){
  let cart;
  let wishlist;
  try{
    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser){
      res.status(422).json({message: "A user with these credentials already exists"});
      return;
    }
    let user = await User.create(req.body);
    cart = await Cart.create({user: user.id});
    wishlist = await Wishlist.create({user: user.id});
    user.cart = cart.id;
    user.wishlist = wishlist.id;
    user = await user.save();
    res.status(200).json(generalizeResult(user));
  }catch(e){
    if(cart !== undefined){
      await Cart.deleteOne({id: cart.id})
    }
    if(wishlist!==undefined){
      await Wishlist.deleteOne({id: wishlist.id});
    }
    if(e.name === "ValidationError"){
      res.status(422).json(e);
    }else{
      res.status(500).json({});
    }
  }
}

function getUser(req, res){
  User.findById(req.params.id)
  .then((user)=>{
    res.status(200).json(generalizeResult(user));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function updateUser(req, res){
  User.findOneAndUpdate({id: req.params.id}, {$set: req.body}, {new: true})
  .then((user, errors)=>{
    if(user){
      res.status(200).json(generalizeResult(user));
    }else{
      res.status(500).json({});
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function removeUser(req, res){
  User.deleteOne({id: req.params.id})
  .then((resp)=>{
    res.status(200).json({deletedCount:resp.deletedCount});
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

async function getSelf(req, res) {
  try{
    if(!req.headers["authorization"]){
      res.status(401).json({});
      return;
    }
    const token = req.headers["authorization"];
    const session = await sessionController.getSession(token);
    if(!session){
      res.status(404).json({})
      return;
    }
    res.status(200).json(session.user);
  }catch(e){
    res.status(500).json({});
  }
}

export default {getUsers, addUser, getUser, updateUser, removeUser, getSelf};