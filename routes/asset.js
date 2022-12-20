import controllers from "../controllers/_controllers.js";
import express from "express";
import path from "path";
import { doesFileExist, removeFileMiddleware } from "../utils/file.js";
import { sendFileStream } from "../utils/response.js";
import { upload } from "../libs/multer.js";
const router = express.Router();
const { assetController } = controllers;

router
  .route("/images/:imageName")
  .get((req, res, next) =>
    sendFileStream(
      res,
      path.join(process.cwd(), "uploads", "public", "images", req.params.imageName)
    )
  )
  .post(
    async (req, res, next) => {
      if (
        !(await doesFileExist(
          path.join(process.cwd(), "uploads", "public", "images"),
          req.params.imageName
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
        destination: path.join(process.cwd(), "uploads", "public", "images"),
        maxCount: 1,
        fileName(req, file) {
          return `${req.params.imageName}`;
        },
        fieldName: "image",
        fileFilter(file) {
          return ["jpeg", "png", "svg"].indexOf(file.mimetype.split("/")[1]) !== -1;
        },
      }),
    (req, res, next) => res.status(200).json({})
  )
  .delete(
    (req, res, next) =>
      removeFileMiddleware(
        req,
        res,
        next,
        path.join(process.cwd(), "uploads", "public", "images", req.params.imageName)
      ),
    (req, res, next) => res.status(200).json({ acknowledged: true, deleteCount: 1 })
  );

router.route("/images/products/:seller/:imageName").get(assetController.getProductImage);

export default router;
