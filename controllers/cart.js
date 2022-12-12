import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Cart } = models;

function getCarts(req, res){
  Cart.find()
  .then((carts)=>{
    carts = generalizeResult(carts);
    res.json(carts)
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function addCart(req, res){
  Cart.create(req.body)
  .then((cart, errors)=>{
    if(cart){
      res.status(200).json(generalizeResult(cart));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function getCart(req, res){
  Cart.findById(req.params.id)
  .then((cart)=>{
    res.status(200).json(generalizeResult(cart));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function updateCart(req, res){
  Cart.findOneAndUpdate({id: req.params.id}, {$set: req.body}, {new: true})
  .then((cart, errors)=>{
    if(cart){
      res.status(200).json(generalizeResult(cart));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

export default {getCarts, addCart, getCart, updateCart};
