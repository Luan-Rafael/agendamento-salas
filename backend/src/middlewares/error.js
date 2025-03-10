import { ApiError } from "../utils/api-error.js";

export function errorHandler(err, req, res, next) {
  console.log(err)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Something went wrong!" });
}
