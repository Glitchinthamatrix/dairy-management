import { MONGOOSE_ID, schemaEnforcer } from "../utils/validation.js";

const updateCartProductsRequestBodySchema = {
  product: { type: MONGOOSE_ID.type, required: true },
};

export function validateUpdateCartProductsRequestBody (req, res, next) {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: updateCartProductsRequestBodySchema,
  });
};
