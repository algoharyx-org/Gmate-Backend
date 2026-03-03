import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimit.js";
import authRouter from "./modules/auth/auth.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";

function bootstrap(app) {
  app.use(apiLimiter);
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/{*any}', (req, res) => {
    res.status(404).json({ message: 'this Router is not found' });
  });

  app.use(errorHandler);
}

export default bootstrap;
