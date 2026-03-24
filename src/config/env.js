import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  jwtResetExpiresIn: process.env.JWT_RESET_EXPIRES_IN,
  emailHost: process.env.EMAIL_HOST,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,
  appName: process.env.APP_NAME,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  maxFileSize: process.env.MAX_FILE_SIZE,
  allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES.split(","),
  allowedDocumentTypes: process.env.ALLOWED_DOCUMENT_TYPES.split(","),
  allowedCompressionTypes: process.env.ALLOWED_COMPRESSION_TYPES.split(","),
};
