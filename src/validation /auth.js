import Joi from 'joi';
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(true),
  email: Joi.string().required(true),
  password: Joi.number().required(true),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
