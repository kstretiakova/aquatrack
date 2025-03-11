// src/validation/auth.js
import Joi from 'joi';

// Схема регистрации пользователя
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

// Схема входа в систему
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
