import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { sendError } from '../utils/response';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });
    }
    sendError(res, err.message, err.statusCode, err.code ? [{ code: err.code }] : undefined);
    return;
  }

  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.type === 'entity.parse.failed') {
    sendError(res, 'Malformed JSON body', 400);
    return;
  }

  if (err instanceof Error && err.message === 'Only image files are allowed') {
    sendError(res, err.message, 400);
    return;
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    sendError(res, 'File is too large', 413);
    return;
  }

  if (err.code === 'P2002') {
    sendError(res, 'Duplicate entry', 409);
    return;
  }

  if (err.code === 'P2025') {
    sendError(res, 'Record not found', 404);
    return;
  }

  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    err.statusCode || 500
  );
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
