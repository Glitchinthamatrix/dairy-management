import express from "express";
import controllers from "../controllers/_controllers.js";
import controllerUtils from "../utils/controller.js";
const router = express.Router();
const { authController } = controllers;

import multer from "multer";
const upload = multer({ dest: "uploads" });

router.route("/sign-up").post(controllerUtils.verifySignUpInfo, authController.signUp);

export default router;
