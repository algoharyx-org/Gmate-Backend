import { HTTP_STATUS } from "../config/constants.js";

export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createBadRequestError = (message = "bad request") => {
  return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
};

export const createUnauthorizedError = (
  message = "Unauthorized - Please login",
) => {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
};

export const createForbiddenError = (
  message = "Forbidden - You don't have permission",
) => {
  return new ApiError(HTTP_STATUS.FORBIDDEN, message);
};

export const createNotFoundError = (message = "Resource not found") => {
  return new ApiError(HTTP_STATUS.NOT_FOUND, message);
};

export const createConflictError = (message = "Resource already exists") => {
  return new ApiError(HTTP_STATUS.CONFLICT, message);
};

export const createValidationError = (message = "Validation error") => {
  return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
};

export const createTooManyRequestsError = (message = "Too many requests") => {
  return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message);
};

export const createInternalError = (message = "Internal server error") => {
  return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};
