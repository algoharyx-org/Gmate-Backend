import { Router } from "express";
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from "./task.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import Validate from "../../middlewares/validate.js";
import {
    createTaskValidation,
    updateTaskValidation,
} from "./task.validator.js";

const taskRouter = Router();

taskRouter.post(
    "/",
    authentication,
    Validate(createTaskValidation),
    createTask
);

taskRouter.get("/", authentication, getAllTasks);

taskRouter.get("/:id", authentication, getTaskById);

taskRouter.put(
    "/:id",
    authentication,
    Validate(updateTaskValidation),
    updateTask
);

taskRouter.delete("/:id", authentication, deleteTask);

export default taskRouter;
