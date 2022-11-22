import { Joi } from "express-validation";

export const userRegisterSchema = {
  body: Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    gender: Joi.string().required(),
    level: Joi.number().required(),
  }),
};
