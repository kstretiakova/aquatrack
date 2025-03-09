import createHttpError from 'http-errors';
import { THIRTY_DAYS } from '../constants/index.js';
import {
  signinUser,
  logoutUser,
  refreshUsersSession,
  signupUser,
} from '../services/users.js';
import { UsersCollection } from '../db/models/user.js';
import { saveFileToCloudinary } from '../services/fileService.js';

export const signupUserController = async (req, res) => {
  const user = await signupUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const signinUserController = async (req, res) => {
  const session = await signinUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const getCurrentUserController = async (req, res) => {
  const { _id, name, email } = req.user;

  res.json({
    status: 200,
    message: 'Current user retrieved successfully!',
    data: { _id, name, email },
  });
};
export const updateUserController = async (req, res) => {
  const { _id } = req.user;
  const updateData = { ...req.body };
  if (req.file) {
    updateData.avatarUrl = await saveFileToCloudinary(req.file.path);
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(_id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: 'User updated successfully!',
    data: updatedUser,
  });
};
