import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import sendResponse from '../utils/sendResponse';
=======
import { sendResponse } from '../utils/sendResponse';
import AppError from '../errors/AppError';
>>>>>>> feat/auth

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
<<<<<<< HEAD
  sendResponse(res, {
    statusCode: 500,
    success: false,
    message: err.message || 'Internal server error',
=======
  const statusCode =
    err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';

  sendResponse(res, {
    statusCode,
    success: false,
    message,
>>>>>>> feat/auth
  });
};
