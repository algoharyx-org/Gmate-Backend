import { HTTP_STATUS } from "../config/constants.js";
import { config } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  if (err.name === "CastError") {
    statusCode = HTTP_STATUS.NOT_FOUND;
    message = "Invalid ID format";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = "Token expired";
  }

  res.status(statusCode).json({
    error: message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};
