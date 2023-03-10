import { generalizeMongooseDocument } from "../libs/mongoose.js";
import models from "../models/_models.js";
import fs from "fs/promises";
import path from "path";
import { ERROR_CODE_FILE_NOT_FOUND } from "../constants.js";
import { filterObject } from "../utils/object.js";
const { Product, Review } = models;

const mapSellerValues = {
  name: "name",
  id: "id",
  email: "email",
};

const mapReviewAuthorValues = {
  name: "name",
  id: "id",
};

async function getProducts(req, res) {
  try {
    let products = [];
    const user = res.locals.user;
    if (!user.isASeller) {
      products = await Product.find().populate(["category", "brand", "addedBy"]);
    } else {
      products = await Product.find({ addedBy: user.id }).populate(["category", "brand"]);
    }
    products = generalizeMongooseDocument(products);
    if (!user.isASeller) {
      products.forEach(
        (product) => (product.addedBy = filterObject(product.addedBy, mapSellerValues))
      );
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({});
  }
}

async function addProduct(req, res) {
  try {
    const product = await Product.create({
      ...req.body,
      addedBy: res.locals.user.id,
      dateAdded: new Date(),
    });
    res.status(200).json(generalizeMongooseDocument(product));
  } catch (e) {
    res.status(500).json({});
  }
}

async function getProduct(req, res) {
  try {
    const user = res.locals.user;
    let product = await Product.findOne({ _id: req.params.productId }).populate(["addedBy"]);
    if (product === null) {
      res.status(404).json({});
      return;
    }
    if (user.isASeller && product.addedBy.id.toString() !== user.id) {
      res.status(401).json({});
      return;
    }
    product = await Product.findOne({ _id: req.params.productId }).populate([
      { path: "addedBy" },
      { path: "brand" },
      { path: "category" },
      { path: "reviews" },
      { path: "reviews", populate: { path: "author" } },
    ]);
    product = generalizeMongooseDocument(product);
    product.addedBy = filterObject(product.addedBy, mapSellerValues);
    product.reviews = product.reviews.map((review) => ({
      id: review.id,
      comment: review.comment,
      author: filterObject(review.author, mapReviewAuthorValues),
    }));
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({});
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    if (product.addedBy.toString() !== res.locals.user.id) {
      res.status(401).json({});
      return;
    }
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    const user = res.locals.user;
    if (product === null) {
      res.status(404).json({});
      return;
    }

    if (!user.isAnAdmin && product.addedBy.toString() !== res.locals.user.id) {
      res.status(401).json({});
      return;
    }

    const result = await Product.deleteOne({ _id: req.params.productId });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({});
  }
}

async function verifySellerProductDirectory(req, res, next) {
  try {
    const productImageDir = path.join(process.cwd(), "uploads", "products");
    const sellerId = res.locals.user.id;
    const dirs = await fs.readdir(productImageDir);
    const dirExists = dirs.indexOf(sellerId) !== -1;

    if (!dirExists) {
      fs.mkdir(path.join(productImageDir, sellerId));
    }
    next();
  } catch (e) {
    res.status(500).json({});
  }
}

async function addImageAddressToProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const imageAddresses = req.files.image.map(
      (file) => `${res.locals.user.id}/${file.filename}`
    );
    const product = await Product.findOne({ _id: productId });
    const updated = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { images: [...product.images, ...imageAddresses] } },
      { new: true }
    );
    res.status(200).json(generalizeMongooseDocument(updated));
  } catch (e) {
    res.status(500).json({});
  }
}

async function removeProductImage(req, res, next) {
  try {
    const { productId, sellerId, imageName } = req.params;
    const product = await Product.findOne({ _id: productId });
    await fs.unlink(path.join(process.cwd(), "uploads", "products", sellerId, imageName));
    const deletedImage = `${sellerId}/${imageName}`;
    const updatedImages = product.images.filter((image) => image !== deletedImage);
    const updated = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { images: updatedImages } },
      { new: true }
    );
    res.status(200).json({ acknowledged: true, deleteCount: 1 });
  } catch (e) {
    if (e.code === ERROR_CODE_FILE_NOT_FOUND) {
      res.status(404).json({});
    } else {
      res.status(500).json({});
    }
  }
}

async function addReview(req, res, next) {
  try {
    const productId = req.params.productId;
    const customerId = res.locals.user.id;
    let review = await (
      await Review.create({ author: customerId, comment: req.body.comment })
    ).populate("author");
    review = generalizeMongooseDocument(review);
    review.author = filterObject(review.author, mapReviewAuthorValues);
    const product = await Product.findOne({ _id: productId });
    product.reviews = product.reviews.concat([review.id]);
    await product.save();
    res.status(200).json(review);
  } catch (e) {
    res.status(500).json({});
  }
}

async function searchProducts(req, res, next) {
  try {
    const { title, category } = req.query;
    const searchParams = {};
    if (title) {
      searchParams.title = { $regex: title, $options: "i" };
    }
    if (category) {
      searchParams.category = category;
    }
    const products = await Product.find(searchParams).populate(["category", "brand"]);
    res.status(200).json(generalizeMongooseDocument(products));
  } catch (e) {
    res.status(500).json({});
  }
}

export default {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  removeProduct,
  verifySellerProductDirectory,
  addImageAddressToProduct,
  removeProductImage,
  addReview,
  searchProducts,
};
