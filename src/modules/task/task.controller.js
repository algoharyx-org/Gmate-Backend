import expressAsyncHandler from "express-async-handler";
import {
    createTaskService,
    deleteTaskService,
    getAllTasksService,
    getTaskByIdService,
    updateTaskService,
} from "./task.service.js";
import { createResponse, successResponse } from "../../utils/APIResponse.js";

// @desc     Create a new task
// @route    POST /tasks
// @access   Private (User must be authenticated and belong to the project)
export const createTask = expressAsyncHandler(async (req, res) => {
    // Pass the authenticated user's ID and the request body to the service layer
    const task = await createTaskService(req.userId, req.body);

    // Return a 201 Created status code and a standard JSON response
    res.status(201).json(createResponse(task, "Task created successfully"));
});

// @desc     Get all tasks (with optional project filter)
// @route    GET /tasks
// @access   Private (User must be authenticated)
export const getAllTasks = expressAsyncHandler(async (req, res) => {
    // Extract optional query parameters like projectId to filter the tasks
    const { projectId } = req.query;

    // Retrieve tasks using the service, passing the user ID and query filters
    const tasks = await getAllTasksService(req.userId, { projectId });

    // Return a 200 OK status code along with the tasks
    res
        .status(200)
        .json(successResponse(tasks, "Tasks retrieved successfully"));
});

// @desc     Get a specific task by its ID
// @route    GET /tasks/:id
// @access   Private (User must be authenticated and have access to the project)
export const getTaskById = expressAsyncHandler(async (req, res) => {
    // Fetch the task details based on the task ID in the URL params
    const task = await getTaskByIdService(req.userId, req.params.id);

    // Return a 200 OK status code and the task details
    res
        .status(200)
        .json(successResponse(task, "Task retrieved successfully"));
});

// @desc     Update an existing task
// @route    PUT /tasks/:id
// @access   Private (User must have appropriate permissions like owner, manager, creator, or assignee)
export const updateTask = expressAsyncHandler(async (req, res) => {
    // Call the service to apply updates dynamically from the request body
    const task = await updateTaskService(
        req.userId,
        req.params.id,
        req.body,
    );

    // Return a 200 OK status code and the updated task
    res
        .status(200)
        .json(successResponse(task, "Task updated successfully"));
});

// @desc     Delete an existing task
// @route    DELETE /tasks/:id
// @access   Private (User must be owner, manager, or creator of the task)
export const deleteTask = expressAsyncHandler(async (req, res) => {
    // Proceed to delete the task using the service logic
    await deleteTaskService(req.userId, req.params.id);

    // Return a 200 OK status code confirming the deletion
    res.status(200).json(successResponse({}, "Task deleted successfully"));
});
