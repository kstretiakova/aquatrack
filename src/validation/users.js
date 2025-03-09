import Joi from 'joi';

export const inputUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(12),
  email: Joi.string().email(),
  gender: Joi.string().valid('male', 'female'),
  weight: Joi.number().min(0).max(250),
  dailySportTime: Joi.number().min(0).max(24),
  dailyNorm: Joi.number().min(500).max(15000),
  avatarUrl: Joi.string().optional(),
}).min(1);
