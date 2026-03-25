import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/user/user.routes.js";
import projectRouter from "./modules/project/project.route.js";
import commentRouter from "./modules/comment/comment.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import contactRouter from "./modules/contact/contact.route.js";

function bootstrap(app) {
  app.use(cors());
  app.use(cookieParser());

  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/projects", projectRouter);
  app.use("/comment", commentRouter);
  app.use("/contact", contactRouter);
  app.use("/tasks", taskRouter);
  app.use((req, res) => {
    res.status(404).json({ message: "this Router is not found" });
  });
  app.use(errorHandler);
}

export default bootstrap;
