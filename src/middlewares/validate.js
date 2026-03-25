import { createValidationError } from "../utils/APIErrors.js";

const Validate = (schema) => {
  return async (req, res, next) => {
    try {
      const { value, error } = schema.validate(
        {
          body: req.body,
          params: req.params,
          query: req.query,
          file: req.file,
          files: req.files,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );

      if (error) {
        const errorDetail = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        const validationError = createValidationError("validation failed");
        validationError.stack = errorDetail;
        throw validationError;
      }

      req.validated = value;
      if (value.body) req.body = value.body;
      if (value.params) req.params = value.params;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default Validate;
