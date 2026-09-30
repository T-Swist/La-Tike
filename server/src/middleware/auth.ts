import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { UserRole } from '@prisma/client';

const readUser = (req: AuthRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const decoded = verifyAccessToken(authHeader.substring(7));
  return { id: decoded.userId, email: decoded.email, role: decoded.role };
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = readUser(req);
    if (!user) {
      sendError(res, 'No token provided', 401);
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

// Attaches req.user when a valid token is present, but never rejects the request.
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    req.user = readUser(req) ?? undefined;
  } catch {
    req.user = undefined;
  }
  next();
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden: Insufficient permissions', 403);
      return;
    }

    next();
  };
};
