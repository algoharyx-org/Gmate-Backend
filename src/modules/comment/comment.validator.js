import Joi from "joi";

const objectIdRule = Joi.string().hex().length(24);

export const addCommentValidation = Joi.object({
  body: Joi.object({
    content: Joi.string().min(1).max(500).trim().required(),
    taskId: objectIdRule.required(),
    userId: objectIdRule.optional(),
  }).required(),
});

export const getCommentsValidation = Joi.object({
  params: Joi.object({
    taskId: objectIdRule.required(),
  }).required(),
});

export const getOneCommentValidation = Joi.object({
  params: Joi.object({
    commentId: objectIdRule.required(),
  }).required(),
});

export const updateCommentValidation = Joi.object({
  params: Joi.object({
    commentId: objectIdRule.required(),
  }).required(),
  body: Joi.object({
    content: Joi.string().min(1).max(500).trim().required(),
    userId: objectIdRule.optional(),
  }).required(),
});

export const deleteCommentValidation = Joi.object({
  params: Joi.object({
    commentId: objectIdRule.required(),
  }).required(),
  body: Joi.object({
    userId: objectIdRule.optional(),
  }).required(),
});