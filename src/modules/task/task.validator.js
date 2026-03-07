import Joi from "joi";

// Validation schema for creating a new task
export const createTaskValidation = Joi.object({
    body: Joi.object({
        title: Joi.string().min(3).max(100).trim().required(),
        description: Joi.string().min(10).trim().required(),
        status: Joi.string()
            .valid("to-do", "in-progress", "done", "archived")
            .optional(),
        priority: Joi.string()
            .valid("low", "medium", "high", "critical")
            .optional(),
        project: Joi.string().hex().length(24).required(), // Must be a valid MongoDB ObjectId
        assignee: Joi.string().hex().length(24).optional(),
        dueDate: Joi.date().optional(),
    }).required(),
});

// Validation schema for updating an existing task
// All fields are optional because the user might only want to update a single field
export const updateTaskValidation = Joi.object({
    body: Joi.object({
        title: Joi.string().min(3).max(100).trim().optional(),
        description: Joi.string().min(10).trim().optional(),
        status: Joi.string()
            .valid("to-do", "in-progress", "done", "archived")
            .optional(),
        priority: Joi.string()
            .valid("low", "medium", "high", "critical")
            .optional(),
        assignee: Joi.string().hex().length(24).optional(),
        dueDate: Joi.date().optional(),
    }).required(),
});

// Validation schema for assigning a task
export const assignTaskValidation = Joi.object({
    body: Joi.object({
        assignee: Joi.string().hex().length(24).required(),
    }).required(),
});
