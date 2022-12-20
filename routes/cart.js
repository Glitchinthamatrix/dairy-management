import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { validateUpdateCartProductsRequestBody } from "../utils/request.js";
const { authController, cartController } = controllers;
const { cartSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(cartController.getCarts)
  .post(cartSchemaEnforcer, cartController.addCart);

router
  .route("/:cartId")
  .get(authController.verifyUserAndPassAsResponseLocal, cartController.getCart)
  .put(
    authController.verifyUserAndPassAsResponseLocal,
    validateUpdateCartProductsRequestBody,
    cartController.addProductToCart
  )
  .delete(
    authController.verifyUserAndPassAsResponseLocal,
    validateUpdateCartProductsRequestBody,
    cartController.removeProductFromCart
  );

export default router;
