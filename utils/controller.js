import models from "../models/_models.js";
import { emailRegex, HUMAN_TYPE_NAMES, STRING, TYPE_VALIDATORS } from "./validation.js";
import { capitalize } from "./string.js";
const { User } = models;

const loginRquestBody = {
  email: {
    type: STRING.type,
    required: true,
    lowercase: true,
    match: emailRegex,
  },
  password: { type: STRING.type, required: true },
};

export const verifyLoginInfo = async (req, res, next) => {
  const errors = {};
  const definedProps = Object.keys(loginRquestBody);
  const bodyProps = Object.keys(req.body);

  // Check for missing required values
  definedProps.forEach((prop) => {
    if (
      loginRquestBody[prop].required &&
      (bodyProps.indexOf(prop) === -1 || !req.body[prop])
    ) {
      errors[prop] = `${capitalize(prop)} is required`;
    }
  });

  // Convert email to lowercase
  if (errors.email === undefined) {
    req.body.email = req.body.email.toLowerCase();
  }

  // Check for unwanted and invalid values
  bodyProps.forEach((prop) => {
    if (definedProps.indexOf(prop) === -1) {
      errors[prop] = "Unknown field";
      return;
    }
    if (errors[prop] === undefined) {
      if (!TYPE_VALIDATORS[loginRquestBody[prop].type](req.body[prop])) {
        errors[prop] = `Invalid '${capitalize(
          HUMAN_TYPE_NAMES[loginRquestBody[prop].type]
        )}' value`;
        return;
      }
      if (loginRquestBody[prop].match) {
        const match = req.body[prop].match(loginRquestBody[prop].match);
        if (!match) {
          errors[prop] = `Invalid ${prop} pattern`;
        }
      }
    }
  });

  // Ensure the email exists and password is correct
  if (errors.email === undefined) {
    const user = await User.findOne({ email: req.body.email });
    if (user === null || user === undefined) {
      errors.email = `This Email is not registered`;
    } else {
      if (req.body.password !== user.password) {
        errors.password = "Incorrect password";
      } else {
        // Sending user object to use in session
        res.locals.user = user;
      }
    }
  }
  if (Object.keys(errors).length === 0) {
    next();
  } else {
    res.status(422).json(errors);
  }
};

export const verifySignUpInfo = async (req, res, next) => {
  const errors = {};

  if (!req.body.name) {
    errors.name = "Full name is required";
  } else if (/^[A-Za-z]+\s+[A-Za-z]$/.test(req.body.name)) {
    errors.name = "Invalid name, Full name is required";
  }

  if (!req.body.email) {
    errors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z0-9]+$/.test(req.body.email)) {
    errors.email = "Invalid email";
  } else {
    const exists = await User.findOne({ email: req.body.email });
    if (exists !== null) {
      errors.email = "This email already exists";
    }
  }

  if (!req.body.password) {
    errors.email = "Password is required";
  }

  if (!req.body.isASeller && !req.body.shippingAddress) {
    errors.shippingAddress = "Shipping address is required";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json(errors);
    return;
  } else {
    next();
  }
};

export default { verifyLoginInfo, verifySignUpInfo };
