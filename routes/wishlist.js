import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { wishlistController } = controllers;
const { wishlistSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(wishlistController.getWishlists)
  .post(wishlistSchemaEnforcer, wishlistController.addWishlist);

router
  .route("/:wishlistId")
  .get(wishlistController.getWishlist)
  .put(wishlistSchemaEnforcer, wishlistController.updateWishlist)
  .delete(wishlistController.removeWishlist);

export default router;
