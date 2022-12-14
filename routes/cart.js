import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { cartController } = controllers;
const { cartSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(cartController.getCarts)
  .post(cartSchemaEnforcer, cartController.addCart);

router
  .route("/:cartId")
  .get(cartController.getCart)
  .put(cartController.addProductToCart)
  .delete(cartController.removeProductFromCart)

export default router;
