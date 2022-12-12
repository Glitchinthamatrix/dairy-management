import models from "../models/_models.js";
import { STRING, MONGOOSE_ID, schemaEnforcer } from "../utils/validation.js";
const { Review } = models;

const properties = {
  author: {type: MONGOOSE_ID.type, required: true },
  comment: {type: STRING.type, required: true }
}

export default async( req, res, next) => {
  return schemaEnforcer(req, res, next, properties, Review);
}