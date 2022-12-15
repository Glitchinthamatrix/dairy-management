import models from "../models/_models.js";
import { STRING, schemaEnforcer } from "../utils/validation.js";
const { Review } = models;

const properties = {
  comment: { type: STRING.type, required: true },
};

export default async (req, res, next) => {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: properties,
    Model: Review,
  });
};
