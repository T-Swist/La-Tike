import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload, TokenPair } from '../types';
import env from '../config/env';

const sign = (payload: object, secret: string, expiresIn: string): string =>
  jwt.sign(payload, secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });

const claims = (payload: JWTPayload) => ({
  userId: payload.userId,
  email: payload.email,
  role: payload.role,
});

export const generateAccessToken = (payload: JWTPayload): string =>
  sign(claims(payload), env.JWT_SECRET, env.JWT_EXPIRES_IN);

export const generateRefreshToken = (payload: JWTPayload): string =>
  sign(
    // jti makes every refresh token unique, even when issued in the same second
    { ...claims(payload), jti: crypto.randomUUID() },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );

export const generateTokenPair = (payload: JWTPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
};

// Refresh tokens are stored hashed so a database leak cannot be replayed.
export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');
