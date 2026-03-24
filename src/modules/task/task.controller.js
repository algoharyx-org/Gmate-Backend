import expressAsyncHandler from "express-async-handler";
import {
    assignTaskService,
    createTaskService,
    deleteTaskService,
    getAllTasksService,
    getMyTasksService,
    getTaskByIdService,
    updateTaskService,
    uploadTaskAttachmentsService,
    deleteTaskAttachmentService,
} from "./task.service.js";
import { createResponse, successResponse } from "../../utils/APIResponse.js";

// @desc     Create a new task
// @route    POST /tasks
// @access   Private 
export const createTask = expressAsyncHandler(async (req, res) => {
    const task = await createTaskService(req.userId, req.body);

    res.status(201).json(createResponse(task, "Task created successfully"));
});

// @desc     Get my tasks (with filtering, search and pagination)
// @route    GET /tasks/me
// @access   Private
export const getMyTasks = expressAsyncHandler(async (req, res) => {
    const result = await getMyTasksService(req.userId, req.query);
    res
        .status(200)
        .json(successResponse(result, "Tasks retrieved successfully"));
});

// @desc     Get all tasks
// @route    GET /tasks
// @access   Private 
export const getAllTasks = expressAsyncHandler(async (req, res) => {
    const { projectId } = req.query;

    const tasks = await getAllTasksService(req.userId, { projectId });
    res
        .status(200)
        .json(successResponse(tasks, "Tasks retrieved successfully"));
});

// @desc     Get a specific task by its ID
// @route    GET /tasks/:id
// @access   Private 
export const getTaskById = expressAsyncHandler(async (req, res) => {
    const task = await getTaskByIdService(req.userId, req.params.id);

    res
        .status(200)
        .json(successResponse(task, "Task retrieved successfully"));
});

// @desc     Update an existing task
// @route    PUT /tasks/:id
// @access   Private 
export const updateTask = expressAsyncHandler(async (req, res) => {
    const task = await updateTaskService(
        req.userId,
        req.params.id,
        req.body,
    );
    res
        .status(200)
        .json(successResponse(task, "Task updated successfully"));
});

// @desc     Delete an existing task
// @route    DELETE /tasks/:id
// @access   Private 
export const deleteTask = expressAsyncHandler(async (req, res) => {
    await deleteTaskService(req.userId, req.params.id);

    res.status(200).json(successResponse({}, "Task deleted successfully"));
});

// @desc     Assign a task to a user
// @route    PATCH /tasks/:id/assign
// @access   Private 
export const assignTask = expressAsyncHandler(async (req, res) => {
    const task = await assignTaskService(
        req.userId,
        req.params.id,
        req.body.assignee
    );
    res
        .status(200)
        .json(successResponse(task, "Task assigned successfully"));
});

// @desc     Upload attachments to a task
// @route    POST /tasks/:id/attachments
// @access   Private
export const uploadTaskAttachments = expressAsyncHandler(async (req, res) => {
    const task = await uploadTaskAttachmentsService(
        req.userId,
        req.params.id,
        req.files
    );
    res
        .status(200)
        .json(successResponse(task, "Attachments uploaded successfully"));
});

// @desc     Delete an attachment from a task
// @route    DELETE /tasks/:id/attachments/:attachmentId
// @access   Private
export const deleteTaskAttachment = expressAsyncHandler(async (req, res) => {
    const task = await deleteTaskAttachmentService(
        req.userId,
        req.params.id,
        req.params.attachmentId
    );
    res
        .status(200)
        .json(successResponse(task, "Attachment deleted successfully"));
});