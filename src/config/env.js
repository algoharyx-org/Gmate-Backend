import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  jwtResetExpiresIn: process.env.JWT_RESET_EXPIRES_IN,
  emailHost: process.env.EMAIL_HOST,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  appName: process.env.APP_NAME,
};
