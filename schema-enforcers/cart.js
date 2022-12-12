import models from "../models/_models.js";
import { MONGOOSE_ID, schemaEnforcer } from "../utils/validation.js";
const { Cart } = models;

const properties = {
  user: {type: MONGOOSE_ID.type, required: true },
  products: {type: MONGOOSE_ID.type }
}

export default async( req, res, next) => {
  return schemaEnforcer({req: req, res: res, next: next, modelProperties: properties, Model: Cart});
}