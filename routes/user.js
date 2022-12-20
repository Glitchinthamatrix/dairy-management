import express from "express";
import path from "path";
import controllers from "../controllers/_controllers.js";
import { upload } from "../libs/multer.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { doesFileExist, removeFileMiddleware } from "../utils/file.js";
import { verifyParamAssociationToUser } from "../utils/request.js";
import { sendFileStream } from "../utils/response.js";
const router = express.Router();
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
    async (req, res, next) => {
      if (
        !(await doesFileExist(
          path.join(process.cwd(), "uploads", "profiles"),
          `${req.params.userId}.jpeg`
        ))
      ) {
        next();
      } else {
        res.status(400).json({});
      }
    },
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
    (req, res, next) => res.status(200).json({})
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
    (req, res, next) => res.status(200).json({})
  )
  .delete(
    authController.verifyUserAndPassAsResponseLocal,
    (req, res, next) => verifyParamAssociationToUser(req, res, next, { userId: "id" }),
    async (req, res, next) => {
      if (
        await doesFileExist(
          path.join(process.cwd(), "uploads", "profiles"),
          `${req.params.userId}.jpeg`
        )
      ) {
        next();
      } else {
        res.status(400).json({});
      }
    },
    (req, res, next) =>
      removeFileMiddleware(
        req,
        res,
        next,
        path.join(process.cwd(), "uploads", "profiles", `${req.params.userId}.jpeg`)
      ),
    (req, res, next) => res.status(200).json({})
  );

export default router;
