// src/services/auth.js

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { UsersCollection } from '../db/models/user.js';
import { THIRTY_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import createHttpError from 'http-errors';

// Функция для создания сессии с токенами доступа и обновления.
const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64'); // Генерация access токена.
  const refreshToken = randomBytes(30).toString('base64'); // Генерация refresh токена.

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

// Регистрация пользователя.
export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email }); // Проверяем, существует ли пользователь с таким email.
  if (user) throw createHttpError(409, 'Email in use'); // Ошибка, если email уже используется.

  const encryptedPassword = await bcrypt.hash(payload.password, 10); // Хэшируем пароль.

  // Создаем нового пользователя в базе данных.
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// Авторизация пользователя.
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email }); // Ищем пользователя по email.
  if (!user) {
    throw createHttpError(404, 'User not found'); // Ошибка, если пользователь не найден.
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Сравниваем хэш пароля.

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized'); // Ошибка, если пароли не совпадают.
  }

  await SessionsCollection.deleteOne({ userId: user._id }); // Удаляем предыдущую сессию пользователя.

  const session = createSession(user._id); // Создаем новую сессию.

  return await SessionsCollection.create(session); // Сохраняем новую сессию в базе данных.
};

// Обновление сессии пользователя.
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId, // Находим сессию по ID.
    refreshToken, // Проверяем, совпадает ли refresh токен.
  });

  if (!session) {
    throw createHttpError(401, 'Session not found'); // Ошибка, если сессия не найдена.
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil); // Проверяем, истек ли refresh токен.

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired'); // Ошибка, если токен истек.
  }

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken }); // Удаляем старую сессию.

  const newSession = createSession(session.userId); // Создаем новую сессию.

  return await SessionsCollection.create(newSession); // Сохраняем новую сессию в базе данных.
};

// Выход пользователя (удаление сессии).
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId }); // Удаляем сессию по ID.
};
