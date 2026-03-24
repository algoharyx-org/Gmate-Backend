import Joi from "joi";
import { PROJECT_STATUS, PROJECT_ROLE } from "../../config/constants.js";

export const createProjectValidation = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).max(100).trim().required(),
    description: Joi.string().min(10).trim().required(),
    status: Joi.string()
      .valid(...Object.values(PROJECT_STATUS))
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
      .valid(...Object.values(PROJECT_STATUS))
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  }).required(),
});

export const addMemberValidation = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    role: Joi.string()
      .valid(...Object.values(PROJECT_ROLE))
      .default(PROJECT_ROLE.DEVELOPER),
  }).required(),
});

export const updateMemberRoleValidation = Joi.object({
  body: Joi.object({
    role: Joi.string().valid(...Object.values(PROJECT_ROLE)).required(),
  }).required(),
});

export const getMyProjectsValidation = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  }).optional(),
});
