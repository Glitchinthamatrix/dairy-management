import path from "path";
import { sendFileStream } from "../utils/response.js";
import { ERROR_CODE_FILE_NOT_FOUND } from "../constants.js";

async function getProductImage(req, res, next) {
  try {
    await sendFileStream(
      res,
      path.join(process.cwd(), "uploads/products", req.params.seller, req.params.imageName)
    );
  } catch (e) {
    const status = e.code === ERROR_CODE_FILE_NOT_FOUND ? 404 : 500;
    res.status(status).json({});
  }
}

export default { getProductImage };
