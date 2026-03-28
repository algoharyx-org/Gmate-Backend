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
import { checkActive } from "../../middlewares/checkActive.js";

const taskRouter = Router();

taskRouter.use(authentication, checkActive)

taskRouter.post(
    "/",
    Validate(createTaskValidation),
    createTask
);

taskRouter.get(
    "/me",
    Validate(getMyTasksValidation),
    getMyTasks
);
taskRouter.get("/", getAllTasks);

taskRouter.get("/:id", getTaskById);

taskRouter.put(
    "/:id",
    Validate(updateTaskValidation),
    updateTask
);

taskRouter.patch(
    "/:id/assign",
    Validate(assignTaskValidation),
    assignTask
);

taskRouter.post(
    "/:id/attachments",
    uploadMultiple("attachments"),
    uploadTaskAttachments
);

taskRouter.delete(
    "/:id/attachments/:attachmentId",
    deleteTaskAttachment
);

taskRouter.delete("/:id", deleteTask);

export default taskRouter;