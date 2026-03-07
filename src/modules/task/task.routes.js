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

// Initialize the express router for task endpoints
const taskRouter = Router();

// Route to create a new task
// Validates incoming body data before reaching the controller
taskRouter.post(
    "/",
    authentication,
    Validate(createTaskValidation),
    createTask
);

// Route to retrieve all tasks associated with the user
// Supports optional query mapping for filtering by project
taskRouter.get("/", authentication, getAllTasks);

// Route to retrieve a single task by its unique ID
// Requires the user to actually belong to the task's project
taskRouter.get("/:id", authentication, getTaskById);

// Route to update an existing task
// Validates the inputs to ensure updates respect original constraints
taskRouter.put(
    "/:id",
    authentication,
    Validate(updateTaskValidation),
    updateTask
);

// Route to completely remove a task from the database
// Only project managers/owners and the task creator can do this
taskRouter.delete("/:id", authentication, deleteTask);

export default taskRouter;
