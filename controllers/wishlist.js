import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Wishlist } = models;

async function getWishlists(req, res) {
  try{
    const wishlists = await Wishlist.find();
    res.status(200).json(generalizeResult(wishlists));
  }catch(e){
    res.status(500).json({});
  }
}

async function addWishlist(req, res) {
  try{
    const wishlist = await Wishlist.create(req.body);
    res.status(200).json(generalizeResult(wishlist));
  }catch(e){
    res.status(500).json({});
  }
}

async function getWishlist(req, res) {
  try{
    const wishlist = await Wishlist.findOne({_id: req.params.wishlistId}).populate(["products"]);
    res.status(200).json(generalizeResult(wishlist));
  }catch(e){
    res.status(500).json({});
  }
}

async function addProductToWishlist(req, res, next) {
  try {
    const wishlistId = req.params.wishlistId;
    const wishlist = await Wishlist.findOne({_id: wishlistId});
    const updated = await Wishlist.findOneAndUpdate(
      { _id: wishlistId },
      { $set: {products: [...wishlist.products, req.body.product]} },
      { new: true }
    );
    res.status(200).json(generalizeResult(updated));
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
}

async function removeProductFromWishlist(req, res, next) {
  try {
    const wishlistId = req.params.wishlistId;
    const wishlist = await Wishlist.findOne({_id: wishlistId});
    const products = wishlist.products.filter((product) => product.toString() !== req.body.product);
    const updated = await Wishlist.findOneAndUpdate(
      { _id: wishlistId },
      { $set: {products: products} },
      { new: true }
    );
    res.status(200).json(generalizeResult(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeWishlist(req, res) {
  try{
    const result = await Wishlist.deleteOne({_id: req.params.wishlistId});
    res.status(200).json(result);
  }catch(e){
    res.status(500).json({});
  }
}

export default { getWishlists, addWishlist, getWishlist, addProductToWishlist, removeProductFromWishlist, removeWishlist };
