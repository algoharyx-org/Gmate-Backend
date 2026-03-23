import cookieParser from "cookie-parser";
import cors from "cors";
import { apiLimiter } from "./middlewares/rateLimit.js";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/user/user.routes.js";
import projectRouter from "./modules/project/project.route.js";
import commentRouter from "./modules/comment/comment.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import contactRouter from "./modules/contact/contact.route.js";

function bootstrap(app) {
  app.use(cors());
  app.use(apiLimiter);
  app.use(cookieParser());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/projects", projectRouter);
  app.use("/api/v1/comment", commentRouter);
  app.use("/api/v1/contact", contactRouter);
  app.use("/api/v1/tasks", taskRouter);
  // app.all("*", (req, res) => {
  //   res.status(404).json({ message: "this Router is not found" });
  // });
  app.use((req, res, next) => {
  res.status(404).json({ message: "this Router is not found" });
});
  app.use(errorHandler);
}

export default bootstrap;
