import Joi from 'joi';

const objectIdRule = Joi.string().hex().length(24);

// بنخلي الـ Schema مسطحة (Flat) عشان الميدل وير القديم يعرف يقرأها
export const addCommentSchema = Joi.object({
    content: Joi.string().required().min(1).max(500),
    taskId: objectIdRule.required(),
    userId: objectIdRule.optional() 
});

export const getCommentsSchema = Joi.object({
    taskId: objectIdRule.required()
});

export const getOneCommentSchema = Joi.object({
    commentId: objectIdRule.required()
});

export const updateCommentSchema = Joi.object({
    commentId: objectIdRule.required(),
    content: Joi.string().required().min(1).max(500),
    userId: objectIdRule.optional()
});

export const deleteCommentSchema = Joi.object({
    commentId: objectIdRule.required(),
    userId: objectIdRule.optional()
});