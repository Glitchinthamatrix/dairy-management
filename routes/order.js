import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { authController, orderController } = controllers;
const { orderSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(authController.verifyUserAndPassAsResponseLocal, orderController.getOrders)
  .post(authController.verifyUserAndPassAsResponseLocal, orderSchemaEnforcer, orderController.addOrder);

router
  .route("/:orderId")
  .get(orderController.getOrder)
  .put(orderSchemaEnforcer, orderController.updateOrder);

router.route("/:orderId/cancel")
.put(authController.verifyUserAndPassAsResponseLocal, orderController.cancelOrder)

export default router;
