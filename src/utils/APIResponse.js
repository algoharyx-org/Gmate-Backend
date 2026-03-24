import { HTTP_STATUS } from "../config/constants.js";

export const successResponse = (data, message = "success") => {
  return {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message,
    data,
  };
};

export const createResponse = (data, message = "created success") => {
  return {
    statusCode: HTTP_STATUS.CREATE,
    success: true,
    message,
    data,
  };
};

export const notfoundResponse = (data, message = "Delete success") => {
  return {
    statusCode: HTTP_STATUS.NOT_FOUND,
    success: true,
    message,
    data,
  };
};
