import models from "../models/_models.js";
import { MONGOOSE_ID, NUMBER, schemaEnforcer, STRING } from "../utils/validation.js";
const { Product } = models;

const properties = {
	title: {type: STRING.type, required: true, unique: [true]},
  description: {type:STRING.type},
  brand: {type: STRING.type},
  price:{type: NUMBER.type, required: true},
  reviews: {type: [MONGOOSE_ID.type]},
  category: {type: STRING.type},
  unitsAvailable: {type: NUMBER.type},
}

export default async( req, res, next) => {
 return schemaEnforcer({req: req, res: res, next: next, modelProperties: properties, Model: Product});
}