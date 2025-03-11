//src/routers/index.js
import { Router } from 'express';
import waterRouter from './water.js';
import usersRouter from './users.js';
import authRouter from './auth.js'; // Подключение маршрутов аутентификации

const router = Router();

router.use('/users', usersRouter);
router.use('/water', waterRouter);
router.use('/auth', authRouter); // Добавление маршрута /auth

export default router;
