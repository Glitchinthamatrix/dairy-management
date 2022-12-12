import { STRING, emailRegex, schemaEnforcer} from "../utils/validation.js";
import models from "../models/_models.js";
const { Brand } = models;

async function isBrandValueTaken({propName, propValue, res}) {
  const exists = await Brand.exists({[propName]: propValue, addedBy: res.locals.user.id});
  return exists ? true : false;
}

const properties = {
  name: {type: STRING.type, required: true, unique: [true, isBrandValueTaken] },
  email:{type: STRING.type, required: true , unique: [true, isBrandValueTaken] , lowercase: true, match: emailRegex}, 
}

export default async( req, res, next) => {
  return schemaEnforcer(req, res, next, properties, Brand);
}