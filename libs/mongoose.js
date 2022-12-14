import mongoose from "mongoose";
import { isObject } from "../utils/object.js";

function convertNestedMongooseDocumentsToObjects(document) {
  if (document === null) {
    return null;
  } else if (Array.isArray(document)) {
    generalizeResult(document);
  } else {
    for (let key in document) {
      if (isObject(document[key]) && !(document[key] instanceof mongoose.Types.ObjectId)) {
        convertNestedMongooseDocumentsToObjects(document[key]);
      }
    }
    document.id = document._id.toString();
    delete document.__v;
    delete document._id;
  }
}

export function generalizeResult(result) {
  if(result === null || result === undefined){
    return result;
  }
  if (Array.isArray(result)) {
    result = result.map((item) => item.toObject());
    for (let item of result) {
      convertNestedMongooseDocumentsToObjects(item);
    }
  } else {
    result = result.toObject();
    convertNestedMongooseDocumentsToObjects(result);
  }
  return result;
}
