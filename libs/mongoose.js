import mongoose from "mongoose";
import { isObject } from "../utils/object.js";

function generalizeArray(array) {
  for (let document of array) {
    generalizeObject(document);
  }
}

function generalizeObject(object) {
  if (!isObject(object) || object instanceof mongoose.Types.ObjectId) {
    return;
  }
  if (object._id) {
    object.id = object._id;
    delete object._id;
    delete object.__v;
  }
  generalizeNestedValues(object);
}

function generalizeNestedValues(object) {
  for (let key in object) {
    if (Array.isArray(object[key])) {
      generalizeArray(object[key]);
    } else if (isObject(object[key])) {
      generalizeObject(object[key]);
    }
  }
}

export function generalizeResult(result) {
  if (Array.isArray(result)) {
    result = result.map((item) => item.toObject());
    generalizeArray(result);
  } else if (result instanceof mongoose.Document) {
    result = result.toObject();
    generalizeObject(result);
  }
  return result;
}
