import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { secretKey } from "../../index.js";

export const authHandler = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    throw new ApiError("No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError("Invalid token", 401);
  }
};
