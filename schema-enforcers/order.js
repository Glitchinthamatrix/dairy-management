import models from "../models/_models.js";
import { MONGOOSE_ID, schemaEnforcer} from "../utils/validation.js";
const { Order } = models;

const properties = {
  products: {type: MONGOOSE_ID.type, required: true },
  user: {type: MONGOOSE_ID.type, required: true },
}

export default async( req, res, next) => {
  return schemaEnforcer({req: req, res: res, next: next, modelProperties: properties, Model: Order});
}