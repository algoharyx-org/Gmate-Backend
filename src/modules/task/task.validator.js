import Joi from "joi";
import { TASK_STATUS, TASK_PRIORITY } from "../../config/constants.js";

export const createTaskValidation = Joi.object({
    body: Joi.object({
        title: Joi.string().min(3).max(100).trim().required(),
        description: Joi.string().min(10).trim().required(),
        status: Joi.string()
            .valid(...Object.values(TASK_STATUS))
            .optional(),
        priority: Joi.string()
            .valid(...Object.values(TASK_PRIORITY))
            .optional(),
        project: Joi.string().hex().length(24).required(), // Must be a valid MongoDB ObjectId
        assignee: Joi.string().hex().length(24).optional(),
        dueDate: Joi.date().optional(),
    }).required(),
});

export const updateTaskValidation = Joi.object({
    body: Joi.object({
        title: Joi.string().min(3).max(100).trim().optional(),
        description: Joi.string().min(10).trim().optional(),
        status: Joi.string()
            .valid(...Object.values(TASK_STATUS))
            .optional(),
        priority: Joi.string()
            .valid(...Object.values(TASK_PRIORITY))
            .optional(),
        assignee: Joi.string().hex().length(24).optional(),
        dueDate: Joi.date().optional(),
    }).required(),
});

export const assignTaskValidation = Joi.object({
    body: Joi.object({
        assignee: Joi.string().hex().length(24).required(),
    }).required(),
});

export const getMyTasksValidation = Joi.object({
    query: Joi.object({
        status: Joi.string()
            .valid(...Object.values(TASK_STATUS))
            .optional(),
        priority: Joi.string()
            .valid(...Object.values(TASK_PRIORITY))
            .optional(),
        projectId: Joi.string().hex().length(24).optional(),
        search: Joi.string().trim().optional(),
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
    }).optional(),
});