import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
const { userController } = controllers;
const { userSchemaEnforcer } = schemaEnforcers;

router.route("/")
.get(userController.getUsers)
.post(userSchemaEnforcer, userController.addUser)

// Do not move /me route down, it will be called inside /:id route with 'me' as id
router.route("/me")
.get(userController.getSelf)

router.route("/:userId")
.get(userController.getUser)
.put(userSchemaEnforcer, userController.updateUser)
.delete(userController.removeUser)

export default router;
