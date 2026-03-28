import Joi from "joi";

export const listNotificationsValidator = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    read: Joi.alternatives()
      .try(Joi.boolean(), Joi.string().valid("true", "false"))
      .optional(),
    sort: Joi.string().optional(),
    fields: Joi.string().optional(),
  }).optional(),
});

export const markReadValidator = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }).required(),
});
