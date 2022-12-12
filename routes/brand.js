import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { brandController, authController } = controllers;
const { brandSchemaEnforcer } = schemaEnforcers;

router.route("/")
.get(authController.verifyUserAndPassAsResponseLocal, brandController.getBrands)
.post(authController.verifyUserAndPassAsResponseLocal, authController.verifySellerFromResponseLocals, brandSchemaEnforcer, brandController.addBrand)

router.route("/:id")
.get(authController.verifyUserAndPassAsResponseLocal, authController.verifySellerFromResponseLocals, brandController.getBrand)
.delete(authController.verifyUserAndPassAsResponseLocal, authController.verifySellerFromResponseLocals, brandController.removeBrand)

export default router;
