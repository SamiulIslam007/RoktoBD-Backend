import { Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/sendResponse';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  sendResponse(res, {
    statusCode: 500,
    success: false,
    message: err.message || 'Internal server error',
  });
};
