import models from "../models/_models.js";
import { STRING, MONGOOSE_ID, schemaEnforcer} from "../utils/validation.js";
const { Wishlist } = models;

const properties = {
	user: {type: STRING.type, required: true },
  products: {type: MONGOOSE_ID.type }
}

export default async( req, res, next) => {
  return schemaEnforcer(req, res, next, properties, Wishlist);
}