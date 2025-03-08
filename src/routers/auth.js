import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

import {
  loginUserController,
  registerUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router(); // Инициализация нового маршрутизатора.

// Маршрут для регистрации пользователя.
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

// Маршрут для входа пользователя.
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// Маршрут для выхода пользователя.
router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
