import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { THIRTY_DAYS } from '../constants/index.js';
import {
  signinUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
  getUsersCounter,
} from '../services/users.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export const signupUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UsersCollection.findOne({ email });
    if (existingUser) {
      return next(createHttpError(409, 'Email already in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UsersCollection.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        _id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
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

export const signinUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersCollection.findOne({ email });
    if (!user) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    const { session } = await signinUser({ email, password });

    if (!session || !session.accessToken) {
      return next(createHttpError(500, 'Failed to generate access token'));
    }

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in!',
      data: {
        accessToken: session.accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          dailyNorm: user.dailyNorm,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized: No refresh token',
      });
    }
    const session = await refreshUsersSession(refreshToken);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logoutUserController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized: No refresh token',
      });
    }
    await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const getCurrentUserController = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      email,
      gender,
      weight,
      dailySportTime,
      dailyNorm,
      avatarUrl,
    } = req.user;

    res.json({
      status: 200,
      message: 'Current user retrieved successfully!',
      data: {
        _id,
        name,
        email,
        gender,
        weight,
        dailySportTime,
        dailyNorm,
        avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { email, ...updateData } = req.body;

    if (email) {
      const existingUser = await UsersCollection.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return next(createHttpError(409, 'Email already in use'));
      }
      updateData.email = email;
    }

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(createHttpError(404, 'User not found or not updated'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated user information!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatarController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const photo = req.file;

    if (!photo) {
      return next(createHttpError(400, 'No file uploaded'));
    }

    const avatarUrl = await saveFileToCloudinary(photo.path);

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(createHttpError(404, 'User not found or not updated'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated user avatar!',
      data: { avatarUrl: updatedUser.avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);
    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPassword(req.body);
    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersCounterController = async (req, res, next) => {
  try {
    const userData = await getUsersCounter();
    const { usersCounter, lastUsersAvatars } = userData;

    res.status(200).json({
      status: 200,
      message: 'Successfully got full info about registered users!',
      data: {
        usersCounter,
        lastUsersAvatars,
      },
    });
  } catch (error) {
    next(error);
  }
};
