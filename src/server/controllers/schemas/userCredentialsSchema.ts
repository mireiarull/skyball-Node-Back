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

export const userLoginSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
