import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Category } = models;

function getCategories(_, res){
    Category.find()
    .then((categories)=>{
        res.status(200).json(generalizeResult(categories));
    })
    .catch((e)=>{
      res.status(500).json({});
    })
}

function addCategory(req, res) {
    Category.create({name: req.body.name})
    .then((category)=>{
        res.status(200).json(generalizeResult(category));
    })
    .catch((_)=>{
        res.status(500)({});
    })
}

function removeCategory(req, res) {
    if(!req.params.id){
        res.status(422).json({id: "Category-ID is required"});
        return;
    }
    Category.delete({id: req.params.id})
    .then((_)=>{
        res.status(200).json({});
    })
    .catch((_)=>{
        res.status(500).json({})
    })
}

export default {getCategories, addCategory, removeCategory};