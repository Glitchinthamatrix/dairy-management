import fs from "fs/promises";
import { ERROR_CODE_FILE_NOT_FOUND } from "../constants.js";

export async function removeFile(address) {
  return await fs.unlink(address);
}

export async function removeFileMiddleware(req, res, next, address) {
  try {
    await removeFile(address);
    next();
  } catch (e) {
    if (e.code === ERROR_CODE_FILE_NOT_FOUND) {
      res.status(404).json({});
    } else {
      res.status(500).json({});
    }
  }
}

export async function doesFileExist(address, filename) {
  let content = await fs.readdir(address, { withFileTypes: true });
  content = content.filter((item) => !item.isDirectory());
  const exists = content.find((item) => item.name === filename);
  return exists !== undefined;
}
