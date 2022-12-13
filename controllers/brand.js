import { generalizeResult } from "../libs/mongoose.js";
import models from "../models/_models.js";
const { Brand, User } = models;

async function getBrands(_, res) {
  const user = res.locals.user;

  const isAnAdmin = user.isAnAdmin;
  const isASeller = user.isASeller;
  const isACustomer = !isAnAdmin && !isASeller;

  let brands = [];
  try {
    if (isAnAdmin || isACustomer) {
      brands = await Brand.find();
    }
    if (isASeller) {
      brands = await Brand.find({ addedBy: user.id });
    }
    res.status(200).json(generalizeResult(brands));
  } catch (e) {
    res.status(500).json({});
  }
}

async function getBrand(req, res, next) {
  const brandId = req.params.brandId;

  const user = res.locals.user;
  const isAnAdmin = user.isAnAdmin;

  try {
    let brand = null;
    if (isAnAdmin) {
      brand = await Brand.findOne({ id: brandId });
    } else {
      brand = await Brand.findOne({ id: brandId, addedBy: user.id });
    }
    if (brand) {
      res.status(200).json(generalizeResult(brand));
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
}

async function addBrand(req, res) {
  try {
    let brand = await Brand.create({ ...req.body, addedBy: res.locals.user.id });
    const seller = await User.findOne({ email: res.locals.user.email });
    seller.affiliateBrands.push(brand._id);
    await seller.save();
    res.status(200).json(generalizeResult(brand));
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateBrand(req, res, next) {
  try {
    const updated = await Brand.findOneAndUpdate(
      { _id: req.params.brandId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(generalizeResult(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeBrand(req, res) {
  try {
    const user = res.locals.user;
    const seller = await User.findOne({ email: user.email });
    await Brand.deleteOne({ _id: req.params.brandId, addedBy: user.id });
    res.status(200).json({});
  } catch (e) {
    res.status(500).json({});
  }
}

export default { getBrands, getBrand, addBrand, updateBrand, removeBrand };
