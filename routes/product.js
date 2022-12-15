import express from "express";
const router = express.Router();
import controllers from "../controllers/_controllers.js";
import schemaEnforcers from "../schema-enforcers/_schema-enforcers.js";
import { upload } from "../libs/multer.js";
import path from "path";
import { validateProductReviewRequestBody } from "../utils/request.js";
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

router
  .route("/:productId/images/:sellerId/:imageName")
  .delete(productController.removeProductImage);

router.route("/:productId/images").post(
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
        return ["png", "jpg", "jpeg"].indexOf(file.mimetype.split("/")[1]) !== -1;
      },
    }),
  productController.addImageAddressToProduct
);

router
  .route("/:productId")
  .get(authController.verifyUserAndPassAsResponseLocal, productController.getProduct)
  .put(
    authController.verifyUserAndPassAsResponseLocal,
    productSchemaEnforcer,
    productController.updateProduct
  )
  .delete(authController.verifyUserAndPassAsResponseLocal, productController.removeProduct);

router
  .route("/:productId/reviews")
  .post(
    authController.verifyUserAndPassAsResponseLocal,
    authController.verifyCustomerFromResponseLocals,
    validateProductReviewRequestBody,
    productController.addReview
  );

export default router;
