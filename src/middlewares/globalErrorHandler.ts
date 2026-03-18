import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/sendResponse';
import AppError from '../errors/AppError';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode =
    err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';

  sendResponse(res, {
    statusCode,
    success: false,
    message,
  });
};
