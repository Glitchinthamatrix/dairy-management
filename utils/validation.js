import mongoose from "mongoose";
import { capitalize } from "./string.js";

// Regular expressions
export const emailRegex = /^[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z0-9]+$/;
export const fullNameRegex = /^[a-zA-Z0-9]*\s+[a-zA-Z0-9]*$/;

// Type constants
const TYPE_STRING = "STR";
const TYPE_NUMBER = "NUM";
const TYPE_INTEGER = "INT";
const TYPE_FLOAT = "FLO";
const TYPE_DATE = "DAT";
const TYPE_MONGOOSE_ID = "MID";
const TYPENAME_STRING = "string";
const TYPENAME_NUMBER = "number";
const STRING_REPRESENTATION_DATE = "[object Date]";

export const STRING = {
  type: TYPE_STRING,
  validator: (value) => typeof value === TYPENAME_STRING,
};
export const NUMBER = {
  type: TYPE_NUMBER,
  validator: (value) => value !== NaN && typeof value === TYPENAME_NUMBER,
};
export const INTEGER = {
  type: TYPE_INTEGER,
  validator: (value) => NUMBER.validator(value) && Number.isInteger(value),
};
export const FLOAT = {
  type: TYPE_FLOAT,
  validator: (value) => NUMBER.validator(value) && !Number.isInteger(value),
};
export const DATE = {
  type: TYPE_DATE,
  validator: (value) => Object.prototype.toString.call(value) === STRING_REPRESENTATION_DATE,
};
export const MONGOOSE_ID = {
  type: TYPE_MONGOOSE_ID,
  validator: (value) => mongoose.Types.ObjectId.isValid(value),
};

// Human types
export const HUMAN_TYPE_NAMES = {
  [TYPE_STRING]: "word",
  [TYPE_NUMBER]: "number",
  [TYPE_INTEGER]: "number",
  [TYPE_FLOAT]: "number",
  [TYPE_DATE]: "date",
  [TYPE_MONGOOSE_ID]: "object ID",
};

// Type validators
export const TYPE_VALIDATORS = {
  [TYPE_STRING]: STRING.validator,
  [TYPE_NUMBER]: NUMBER.validator,
  [TYPE_INTEGER]: INTEGER.validator,
  [TYPE_FLOAT]: FLOAT.validator,
  [TYPE_DATE]: DATE.validator,
  [TYPE_MONGOOSE_ID]: MONGOOSE_ID.validator,
};

export const schemaEnforcer = async ({req, res, next, modelProperties, Model, belongingIds}) => {
  const errors = {};
  const modelPropertyKeys = Object.keys(modelProperties);
  const bodyProperties = Object.keys(req.body);

  // Check for unknown fields passed in the request body
  bodyProperties.forEach((prop) => {
    if (modelPropertyKeys.indexOf(prop) === -1) {
      errors[prop] = "Unknown field";
      return;
    }
  });

  // Check for missing required values
  modelPropertyKeys.forEach((prop) => {
    if (
      modelProperties[prop].required &&
      (bodyProperties.indexOf(prop) === -1 || !req.body[prop])
    ) {
      errors[prop] = `${capitalize(prop)} is required`;
    }
  });

  // Check for invalid values, transform if needed and match pattern if given any
  bodyProperties.forEach((prop) => {
    if (errors[prop] === undefined) {
      if(req.body[prop] === null){
        delete req.body[prop];
        return;
      }

      // Check for wrong types
      if (!TYPE_VALIDATORS[modelProperties[prop].type](req.body[prop])) {
        errors[prop] = `Invalid value , ${capitalize(prop)} must be a ${
          HUMAN_TYPE_NAMES[modelProperties[prop].type]
        }`;
        return;
      }

      // Check if values need to be transformed
      if (modelProperties[prop] !== null && modelProperties[prop].lowercase) {
        req.body[prop] = req.body[prop].toLowerCase();
      }

      // Check for pattern mismatch
      if (modelProperties[prop].match) {
        const match = req.body[prop].match(modelProperties[prop].match);
        if (!match) {
          errors[prop] = `Invalid ${prop} pattern`;
        }
      }
    }
  });

  // Ensure uniqueness of unique values
  for (let i = 0; i < bodyProperties.length; i++) {
    if (errors[bodyProperties[i]] !== undefined) {
      continue;
    }

    if (modelProperties[bodyProperties[i]].unique) {
      let isTaken = false;
      if (
        modelProperties[bodyProperties[i]].unique instanceof Array &&
        modelProperties[bodyProperties[i]].unique[1]
      ) {
        // Check if there is a validator function provided as an argument
        // Use the validator function if provided
        // The function checks if the values being used aleady exist on database
        isTaken = await modelProperties[bodyProperties[i]].unique[1]({
          propName: bodyProperties[i],
          propValue: req.body[bodyProperties[i]],
          res: res,
        });
      } else {
        const entity = await Model.exists({ [bodyProperties[i]]: req.body[bodyProperties[i]] });
        if(entity === null){
          isTaken = false;
        }else{
          isTaken = belongingIds ? (belongingIds.indexOf(entity._id.toString()) === -1) : true;
        }
      }
      if (isTaken) {
        errors[bodyProperties[i]] = `This ${capitalize(bodyProperties[i])} is already in use`;
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    res.status(422).json(errors);
  }
};
