import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Review } = models;

function addReview(req, res){
  Review.create(req.body)
  .then((review, errors)=>{
    if(review){
      res.status(200).json(generalizeResult(review));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function getReview(req, res){
  Review.findById(req.params.id)
  .then((review)=>{
    res.status(200).json(generalizeResult(review));
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function updateReview(req, res){
  Review.findOneAndUpdate({id: req.params.id}, {$set: req.body}, {new: true})
  .then((review, errors)=>{
    if(review){
      res.status(200).json(generalizeResult(review));
    }else{
      res.status(422).json(errors);
    }
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

function removeReview(req, res){
  Review.deleteOne({id: req.params.id})
  .then((resp)=>{
    res.status(200).json({deletedCount: resp.deletedCount});
  })
  .catch((e)=>{
    res.status(500).json({});
  })
}

export default {addReview, getReview, updateReview, removeReview};
