import multer from "multer";
import { ERROR_CODE_FILE_NOT_FOUND } from "../constants.js";
import { capitalize } from "../utils/string.js";

class FileUploadError extends Error {
  constructor(code, message = null) {
    super(message);
    this.code = code;
  }
}

const productStoarge = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, req.locals.destination);
    } catch (e) {
      cb(new FileUploadError(FILE_UPLOAD_ERROR_INCORRECT_DESTINATION));
    }
  },
  filename: function (req, file, cb) {
    try {
      console.log("determining filename");
      const name = req.locals.fileName(req, file);
      cb(null, name);
      console.log("determined filename");
    } catch (e) {
      cb(new FileUploadError(FILE_UPLOAD_ERROR_INCORRECT_FILENAME));
    }
  },
});

export const multerInstance = multer({
  storage: productStoarge,
  fileFilter: (req, file, cb) => {
    try {
      // Check if required body params are present,
      // Check here, because multer only provides body params after it's initiated
      if (req.locals.requiredBodyParams) {
        const errors = {};
        for (let requirement of req.locals.requiredBodyParams) {
          if (req.body[requirement] === undefined) {
            errors[requirement] = `${capitalize(requirement)} is required`;
          }
        }
        if (Object.keys(errors).length > 0) {
          res.status(422).json(errors);
          return;
        }
      }

      const isValid = req.locals.fileFilter(file);
      if (!isValid) {
        cb(new FileUploadError(FILE_UPLOAD_ERROR_MALICIOUS_TYPE));
      } else {
        cb(null, isValid);
      }
      console.log("ran filter");
    } catch (e) {
      cb(new FileUploadError(FILE_UPLOAD_ERROR_FILTRATION));
    }
  },
});

export async function upload({
  req,
  res,
  next,
  fieldName,
  requiredBodyParams,
  fileFilter,
  destination,
  fileName,
  maxCount,
}) {
  try {
    req.locals.fileFilter = fileFilter;
    req.locals.destination = destination;
    req.locals.fileName = fileName;
    req.locals.requiredBodyParams = requiredBodyParams;

    const uploadFn = multerInstance.fields([{ name: fieldName, maxCount: maxCount }]);

    const promise = await new Promise((resolve, reject) => {
      const _reject = { isError: false, code: null };

      uploadFn(req, res, (err) => {
        if (err) {
          _reject.isError = true;
          if (err.code) {
            _reject.code = err.code;
          }
        }

        if (_reject.isError) {
          reject(_reject);
        } else {
          resolve(true);
        }
      });
    });

    if (promise) {
      next();
    }
  } catch (e) {
    let code = null;
    if (e.code) {
      code = e.code;
    }

    if (code === FILE_UPLOAD_ERROR_MAX_COUNT_EXCEEDED) {
      res
        .status(422)
        .json({ [fieldName]: FILE_UPLOAD_ERROR_MESSAGE_MAX_COUNT_EXCEEDED(maxCount) });
    } else if (code === FILE_UPLOAD_ERROR_MALICIOUS_TYPE) {
      res.status(422).json({ [fieldName]: "Invalid file type" });
      return;
    } else {
      const errorMessageByCode = {
        [ERROR_CODE_FILE_NOT_FOUND]: "Directory not found",
        [FILE_UPLOAD_ERROR_INCORRECT_DESTINATION]: "Incorrect destination",
        [FILE_UPLOAD_ERROR_INCORRECT_FILENAME]: "Incorrect filename",
        [FILE_UPLOAD_ERROR_FILTRATION]: "Filtration error",
      };
      // Log error to help debug upload problems faster
      console.log("Multer error: ", errorMessageByCode[code]);
      res.status(500).json({});
      return;
    }
  }
}

const FILE_UPLOAD_ERROR_MALICIOUS_TYPE = "MAL-TYPE";
const FILE_UPLOAD_ERROR_MAX_COUNT_EXCEEDED = "LIMIT_UNEXPECTED_FILE";
const FILE_UPLOAD_ERROR_INCORRECT_FILENAME = "INCORRECT-FILENAME";
const FILE_UPLOAD_ERROR_INCORRECT_DESTINATION = "INCORRECT-DESTINATION";
const FILE_UPLOAD_ERROR_FILTRATION = "FILTRATION-ERROR";

const FILE_UPLOAD_ERROR_MESSAGE_MAX_COUNT_EXCEEDED = (num) =>
  `Number of files must not be greater than ${num}`;
