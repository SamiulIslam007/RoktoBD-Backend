import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import sendResponse from '../utils/sendResponse';
=======
import { sendResponse } from '../utils/sendResponse';
>>>>>>> feat/auth

const JWT_SECRET = process.env.JWT_SECRET || 'roktobd-secret';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized. Please log in.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as Request & { user: { userId: string } }).user = {
      userId: decoded.userId,
    };
    next();
  } catch {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Invalid token',
    });
  }
};
