import multer from "multer";
import path from "path";
import { config } from "../config/env.js";
import { createBadRequestError } from "../utils/APIErrors.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileExtension = path
    .extname(file.originalname)
    .substring(1)
    .toLowerCase();

  const allowedImageTypes = config.allowedImageTypes;
  const allowedDocumentTypes = config.allowedDocumentTypes;
  const allowedCompressionTypes = config.allowedCompressionTypes;

  if (
    allowedImageTypes.includes(fileExtension) ||
    allowedDocumentTypes.includes(fileExtension) ||
    allowedCompressionTypes.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(createBadRequestError("Invalid file type"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

export const uploadSingle = (fileName) => upload.single(fileName);

export const uploadMultiple = (fileName) => upload.array(fileName);

export const uploadMixed = (fields) => upload.fields(fields);