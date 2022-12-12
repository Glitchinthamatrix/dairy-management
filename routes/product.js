import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { upload } from "../libs/multer.js";
import path from "path";
const { authController, productController } = controllers;
const { productSchemaEnforcer } = schemaEnforcers;

router
  .route("/")
  .get(authController.verifyUserAndPassAsResponseLocal, productController.getProducts)
  .post(
    authController.verifyUserAndPassAsResponseLocal,
    authController.verifySellerFromResponseLocals,
    productSchemaEnforcer,
    productController.addProduct
  );

router.route("/image").post(
  authController.verifyUserAndPassAsResponseLocal,
  productController.verifySellerProductDirectory,
  (req, res, next) =>
    upload({
      req: req,
      res: res,
      next: next,
      destination: path.join(process.cwd(), "uploads", "products", res.locals.user.id),
      maxCount: 1,
      fileName(req, file) {
        return `${Date.now()}.${file.mimetype.split("/")[1]}`;
      },
      fieldName: "image",
      fileFilter(file) {
        return ["png", "jpg"].indexOf(file.mimetype.split("/")[1]) !== -1;
      },
      requiredBodyParams: ["productId"],
    }),
  productController.addImageAddressToProduct
);

router.route("/image/:sellerId/:imageName").delete(productController.removeProductImage);

router
  .route("/:id")
  .get(authController.verifyUserAndPassAsResponseLocal, productController.getProduct)
  .put(
    authController.verifyUserAndPassAsResponseLocal,
    productSchemaEnforcer,
    productController.updateProduct
  )
  .delete(authController.verifyUserAndPassAsResponseLocal, productController.removeProduct);

export default router;
