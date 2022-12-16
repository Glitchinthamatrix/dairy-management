import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { authController, reviewController } = controllers;
const { reviewSchemaEnforcer } = schemaEnforcers;
import { validateProductReviewRequestBody } from "../utils/request.js";

router
  .route("/:reviewId")
  .get(reviewController.getReview)
  .put(authController.verifyUserAndPassAsResponseLocal, authController.verifyCustomerFromResponseLocals, validateProductReviewRequestBody, reviewController.updateReview)
  .delete(authController.verifyUserAndPassAsResponseLocal, authController.verifyCustomerFromResponseLocals, reviewController.removeReview);

export default router;
