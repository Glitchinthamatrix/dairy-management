import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import {validateUpdateWishlistProductsRequestBody} from "../utils/request.js";
const { wishlistController } = controllers;
const { wishlistSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(wishlistController.getWishlists)
  .post(wishlistSchemaEnforcer, wishlistController.addWishlist);

router
  .route("/:wishlistId")
  .get(wishlistController.getWishlist)
  .put(validateUpdateWishlistProductsRequestBody, wishlistController.addProductToWishlist)
  .delete(validateUpdateWishlistProductsRequestBody, wishlistController.removeProductFromWishlist);

export default router;
