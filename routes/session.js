import express from "express";
import controllerUtils from "../utils/controller.js";
import controllers from "../controllers/_controllers.js";
const { sessionController } = controllers;

const router = express.Router();

router
  .route("/")
  .post(controllerUtils.verifyLoginInfo, sessionController.sessionCreationMiddleware)
  .delete(sessionController.sessionDeletionMiddleware);

export default router;
