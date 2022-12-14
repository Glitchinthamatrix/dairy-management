import mongoose from "mongoose";

export function sendFileStream(res, path) {
  return new Promise((resolve, reject) => {
    res.sendFile(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getGenericSchemaFieldName(field) {
  return field === "_id" ? "ID" : field.replace(/"/g, "");
}

function generalizeMongooseCastError(error) {
  const splits = error.message.split(" ");
  const model = splits[splits.length - 1].replace(/"/g, "");
  const field = getGenericSchemaFieldName(obj.path);
  return `${error.stringValue} is not a valid ${model} ${field}`;
}

function generalizeMongooseValidationErrors(error) {
  const fieldErrors = {};
  for (let field in error.errors) {
    const fieldValue = error.errors[field];
    let message = fieldValue.properties.message;
    if (!message) {
      message = `${getGenericSchemaFieldName(fieldValue.properties.path)} is ${
        fieldValue.properties.type
      }`;
    }
    fieldErrors[field] = message;
  }
  return fieldErrors;
}

export function handleUnexpectedMiddlewareError(error, res) {
  if (error instanceof mongoose.Error.CastError) {
    res.status(422).json(generalizeMongooseCastError(error));
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(422).json(generalizeMongooseValidationErrors(error));
  } else {
    res.status(500).json({});
  }
}
