import models from "../models/_models.js";
import { STRING, MONGOOSE_ID, emailRegex, fullNameRegex } from "../utils/validation.js";
const { User } = models;

const properties = {
  name: { type: STRING.type, required: true, match: fullNameRegex },
  email: {
    type: STRING.type,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex,
  },
  shippingAddress: { type: STRING.type, required: true },
  cart: { type: MONGOOSE_ID.type },
  wishlist: { type: MONGOOSE_ID.type },
};

export default async (req, res, next) => {
  return schemaEnforcer({
    req: req,
    res: res,
    next: next,
    modelProperties: properties,
    Model: User,
  });
};
