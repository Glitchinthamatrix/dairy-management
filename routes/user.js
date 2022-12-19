import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { upload } from "../libs/multer.js";
import { verifyParamAssociationToUser } from "../utils/request.js";
import { removeFileMiddleware } from "../utils/file.js";
import path from "path";
import { sendFileStream } from "../utils/response.js";
const { authController, userController } = controllers;
const { userSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(userController.getUsers)
  .post(userSchemaEnforcer, userController.addUser);

// Do not move /me route down, it will be called inside /:id route with 'me' as id
router
  .route("/me")
  .get(authController.verifyUserAndPassAsResponseLocal, userController.getSelf);

router
  .route("/:userId")
  .get(userController.getUser)
  .put(userSchemaEnforcer, userController.updateUser)
  .delete(userController.removeUser);

router
  .route("/:userId/picture")
  .get(authController.verifyUserAndPassAsResponseLocal, (req, res, next) =>
    sendFileStream(
      res,
      path.join(process.cwd(), "uploads", "profiles", `${req.params.userId}.jpeg`)
    )
  )
  .post(
    authController.verifyUserAndPassAsResponseLocal,
    (req, res, next) => verifyParamAssociationToUser(req, res, next, { userId: "id" }),
    (req, res, next) =>
      upload({
        req: req,
        res: res,
        next: next,
        destination: path.join(process.cwd(), "uploads", "profiles"),
        maxCount: 1,
        fileName(req, file) {
          return `${req.params.userId}.${file.mimetype.split("/")[1]}`;
        },
        fieldName: "picture",
        fileFilter(file) {
          return ["jpeg"].indexOf(file.mimetype.split("/")[1]) !== -1;
        },
      }),
    userController.addProfilePicture
  )
  .put(
    authController.verifyUserAndPassAsResponseLocal,
    (req, res, next) => verifyParamAssociationToUser(req, res, next, { userId: "id" }),
    (req, res, next) =>
      removeFileMiddleware(
        req,
        res,
        next,
        path.join(process.cwd(), "uploads", "profiles", `${req.params.userId}.jpeg`)
      ),
    (req, res, next) =>
      upload({
        req: req,
        res: res,
        next: next,
        destination: path.join(process.cwd(), "uploads", "profiles"),
        maxCount: 1,
        fileName(req, file) {
          return `${req.params.userId}.${file.mimetype.split("/")[1]}`;
        },
        fieldName: "picture",
        fileFilter(file) {
          return ["jpeg"].indexOf(file.mimetype.split("/")[1]) !== -1;
        },
      }),
    userController.updateProfilePicture
  )
  .delete(
    authController.verifyUserAndPassAsResponseLocal,
    (req, res, next) => verifyParamAssociationToUser(req, res, next, { userId: "id" }),
    (req, res, next) =>
      removeFileMiddleware(
        req,
        res,
        next,
        path.join(process.cwd(), "uploads", "profiles", `${req.params.userId}.jpeg`)
      ),
    userController.removeProfilePicture
  );

export default router;
