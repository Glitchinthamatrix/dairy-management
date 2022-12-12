import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Wishlist } = models;

function getWishlists(req, res){
  Wishlist.find()
  .then((wishlists)=>{
    res.status(200).json(generalizeResult(wishlists));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function addWishlist(req, res){
  Wishlist.create(req.body)
  .then((wishlist, errors)=>{
    if(user){
      res.status(200).json(generalizeResult(wishlist));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function getWishlist(req, res){
  Wishlist.findById(req.params.wishlistId)
  .then((wishlist)=>{
    res.status(200).json(generalizeResult(wishlist));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function updateWishlist(req, res){
  Wishlist.findOneAndUpdate({_id: req.params.wishlistId}, {$set: req.body}, {new: true})
  .then((wishlist, errors)=>{
    if(wishlist){
      res.status(200).json(generalizeResult(wishlist));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function removeWishlist(req, res){
  Wishlist.deleteOne({id: req.params.wishlistId})
  .then((resp)=>{
    res.status(200).json({deleteCount: resp.deletedCount});
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

export default {getWishlists, addWishlist, getWishlist, updateWishlist, removeWishlist};
