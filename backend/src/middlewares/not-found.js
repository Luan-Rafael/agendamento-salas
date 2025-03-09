import { ApiError } from "../utils/api-error.js";

export function notFoundHandler(req, res, next) {
    next( new ApiError("Not found", 404))
}
 