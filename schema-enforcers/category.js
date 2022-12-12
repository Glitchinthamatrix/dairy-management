import { STRING, schemaEnforcer} from "../utils/validation.js";
import models from "../models/_models.js";
const { Category } = models;

const properties = {
  name: {type: STRING.type, required: true },
}

export default async( req, res, next) => {
  return schemaEnforcer(req, res, next, properties, Category);
}