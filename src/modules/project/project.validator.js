import Joi from "joi";

export const createProjectValidation = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    description: Joi.string().min(10).trim().required(),
    status: Joi.string()
      .valid("planning", "active", "on-hold", "completed")
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  }).required(),
});

export const updateProjectValidation = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).max(100).trim().optional(),
    description: Joi.string().min(10).trim().optional(),
    status: Joi.string()
      .valid("planning", "active", "on-hold", "completed")
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  }).required(),
});

export const addMemberValidation = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    role: Joi.string()
      .valid("manager", "developer", "viewer")
      .default("developer"),
  }).required(),
});

export const updateMemberRoleValidation = Joi.object({
  body: Joi.object({
    role: Joi.string().valid("manager", "developer", "viewer").required(),
  }).required(),
});
