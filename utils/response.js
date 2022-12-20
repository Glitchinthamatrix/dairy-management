import { ERROR_CODE_FILE_NOT_FOUND } from "../constants.js";

function _streamFileContent(res, path) {
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

export async function sendFileStream(res, path) {
  try {
    await _streamFileContent(res, path);
  } catch (e) {
    if (e.code === ERROR_CODE_FILE_NOT_FOUND) {
      res.status(404).json({});
    } else {
      res.status(500).json({});
    }
  }
}
