import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { categoryController } = controllers;
const { categorySchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categorySchemaEnforcer, categoryController.addCategory);

router.route("/").delete(categoryController.removeCategory);

export default router;
