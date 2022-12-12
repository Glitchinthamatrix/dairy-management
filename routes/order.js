import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { orderController } = controllers;
const { orderSchemaEnforcer } = schemaEnforcers;

router.route("/")
.get(orderController.getOrders)

router.route("/:id")
.get(orderController.getOrder)
.put(orderSchemaEnforcer, orderController.updateOrder)

export default router;
