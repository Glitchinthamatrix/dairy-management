import models from "../models/_models.js";
import { MONGOOSE_ID, STRING, schemaEnforcer } from "../utils/validation.js";
const { Order } = models;

const properties = {
  product: { type: MONGOOSE_ID.type, required: true },
  deliveryAddress: { type: STRING.type, required: true },
};

export default async (req, res, next) => {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: properties,
    Model: Order,
  });
};
