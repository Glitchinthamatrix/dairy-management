import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { reviewController } = controllers;
const { reviewSchemaEnforcer } = schemaEnforcers;

router.route("/")
.post(reviewSchemaEnforcer, reviewController.addReview)

router.route("/:id")
.get(reviewController.getReview)
.put(reviewSchemaEnforcer, reviewController.updateReview)
.delete(reviewController.removeReview)

export default router;
