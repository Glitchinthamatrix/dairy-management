import express from "express";
import controllers from "../controllers/_controllers.js";
const router = express.Router();
const { assetController } = controllers;

router.route("/images/products/:seller/:imageName").get(assetController.getProductImage);

export default router;
