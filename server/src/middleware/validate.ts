import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { sendError } from '../utils/response';

// Validates req.body and replaces it with the parsed value, so unknown
// fields are stripped and defaults are applied before the controller runs.
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        sendError(res, errors[0]?.message ?? 'Validation failed', 400, errors);
        return;
      }
      next(error);
    }
  };
};
