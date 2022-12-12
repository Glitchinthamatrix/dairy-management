import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Order } = models;

function getOrders(req, res){
  Order.find()
  .then((orders)=>{
    res.status(200).json(generalizeResult(orders));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function addOrders(req, res) {
  Order.create(req.body)
  .then((order, errors)=>{
    if(order){
      res.status(200).json(generalizeResult(order));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}
function getOrder(req, res){
  Order.findById(req.params.id)
  .then((order)=>{
    res.status(200).json(generalizeResult(order));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function updateOrder(req, res){
  Order.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true})
  .then((order, errors)=>{
    if(order){
      res.status(200).json(generalizeResult(order));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

export default {getOrders, addOrders, getOrder, updateOrder};
