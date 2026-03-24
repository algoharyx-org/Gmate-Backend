import { Router } from "express";
import {
    assignTask,
    createTask,
    deleteTask,
    getAllTasks,
    getMyTasks,
    getTaskById,
    updateTask,
    uploadTaskAttachments,
    deleteTaskAttachment,
} from "./task.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import Validate from "../../middlewares/validate.js";
import {
    assignTaskValidation,
    createTaskValidation,
    getMyTasksValidation,
    updateTaskValidation,
} from "./task.validator.js";
import { uploadMultiple } from "../../middlewares/upload.js";

const taskRouter = Router();

taskRouter.post(
    "/",
    authentication,
    Validate(createTaskValidation),
    createTask
);

taskRouter.get(
    "/me",
    authentication,
    Validate(getMyTasksValidation),
    getMyTasks
);
taskRouter.get("/", authentication, getAllTasks);

taskRouter.get("/:id", authentication, getTaskById);

taskRouter.put(
    "/:id",
    authentication,
    Validate(updateTaskValidation),
    updateTask
);

taskRouter.patch(
    "/:id/assign",
    authentication,
    Validate(assignTaskValidation),
    assignTask
);

taskRouter.post(
    "/:id/attachments",
    authentication,
    uploadMultiple("attachments"),
    uploadTaskAttachments
);

taskRouter.delete(
    "/:id/attachments/:attachmentId",
    authentication,
    deleteTaskAttachment
);

taskRouter.delete("/:id", authentication, deleteTask);

export default taskRouter;