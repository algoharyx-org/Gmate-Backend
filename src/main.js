import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimit.js";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/user/user.routes.js";
import projectRouter from "./modules/project/project.route.js";
import commentRouter from "./modules/comment/comment.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

function bootstrap(app) {
  app.use(apiLimiter);
  app.use(cookieParser());

  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/projects", projectRouter);
  app.use("/comment", commentRouter);

app.use((req, res) => {
  res.status(404).json({ message: "this Router is not found" });
});

  app.use(errorHandler);
}

export default bootstrap;