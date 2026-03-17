import { Router } from "express";
import {
    assignTask,
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from "./task.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import Validate from "../../middlewares/validate.js";
import {
    assignTaskValidation,
    createTaskValidation,
    updateTaskValidation,
} from "./task.validator.js";
import { fileValidation, uploadFile } from "../../middlewares/multer.js";

const taskRouter = Router();

taskRouter.post(
    "/",
    authentication,
    uploadFile([...fileValidation.image, ...fileValidation.file]).array("files", 5),
    Validate(createTaskValidation),
    createTask
);

taskRouter.get("/", authentication, getAllTasks);

taskRouter.get("/:id", authentication, getTaskById);

taskRouter.put(
    "/:id",
    authentication,
    uploadFile([...fileValidation.image, ...fileValidation.file]).array("files", 5),
    Validate(updateTaskValidation),
    updateTask
);


taskRouter.patch(
    "/:id/assign",
    authentication,
    Validate(assignTaskValidation),
    assignTask
);

taskRouter.delete("/:id", authentication, deleteTask);

export default taskRouter;
