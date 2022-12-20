import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { validateUpdateWishlistProductsRequestBody } from "../utils/request.js";
const { authController, wishlistController } = controllers;
const { wishlistSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(authController.verifyUserAndPassAsResponseLocal, wishlistController.getWishlists)
  .post(wishlistSchemaEnforcer, wishlistController.addWishlist);

router
  .route("/:wishlistId")
  .get(authController.verifyUserAndPassAsResponseLocal, wishlistController.getWishlist)
  .put(
    authController.verifyUserAndPassAsResponseLocal,
    validateUpdateWishlistProductsRequestBody,
    wishlistController.addProductToWishlist
  )
  .delete(
    authController.verifyUserAndPassAsResponseLocal,
    validateUpdateWishlistProductsRequestBody,
    wishlistController.removeProductFromWishlist
  );

export default router;
