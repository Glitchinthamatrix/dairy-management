import { MONGOOSE_ID, STRING, schemaEnforcer } from "../utils/validation.js";

const updateCartProductsRequestBodySchema = {
  product: { type: MONGOOSE_ID.type, required: true },
};

const updateWishlistProductsRequestBodySchema = {
  product: { type: MONGOOSE_ID.type, required: true },
};

export function validateUpdateCartProductsRequestBody(req, res, next) {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: updateCartProductsRequestBodySchema,
  });
}

export function validateUpdateWishlistProductsRequestBody(req, res, next) {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: updateWishlistProductsRequestBodySchema,
  });
}

const reviewRequestBodySchema = {
  comment: { type: STRING.type, required: true },
};

export function validateProductReviewRequestBody(req, res, next) {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: reviewRequestBodySchema,
  });
}

export function verifyParamAssociationToUser(req, res, next, map) {
  for (let param in map) {
    if (req.params[param] !== res.locals.user[map[param]]) {
      res.status(401).json({});
      return;
    }
  }
  next();
}
