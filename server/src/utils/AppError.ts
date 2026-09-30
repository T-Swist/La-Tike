import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (message: string, code?: string) => new AppError(message, 400, code);
export const unauthorized = (message = 'Unauthorized') => new AppError(message, 401);
export const forbidden = (message = 'Forbidden') => new AppError(message, 403);
export const notFound = (message = 'Not found') => new AppError(message, 404);
export const conflict = (message: string, code?: string) => new AppError(message, 409, code);

// Forwards rejected promises from async route handlers to the error middleware.
export const asyncHandler =
  <R extends Request>(fn: (req: R, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: R, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
