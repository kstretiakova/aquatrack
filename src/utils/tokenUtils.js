import { randomBytes } from 'crypto';
import { THIRTY_DAYS, THIRTY_MINUTES } from '../constants/index.js';

export const createSession = (userId) => {
  return {
    userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};
