import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
<<<<<<< HEAD
import sendResponse from '../utils/sendResponse';
=======
import { sendResponse } from '../utils/sendResponse';
>>>>>>> feat/auth

interface RequestData {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export const validateRequest = (schema: z.ZodType<RequestData>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
<<<<<<< HEAD
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as RequestData;
=======
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as RequestData;
>>>>>>> feat/auth
      if (parsed.body) req.body = parsed.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
<<<<<<< HEAD
        const message = error.issues.map((e: { message?: string }) => e.message).filter(Boolean).join(', ') || 'Validation failed';
=======
        const message =
          error.issues
            .map((e: { message?: string }) => e.message)
            .filter(Boolean)
            .join(', ') || 'Validation failed';
>>>>>>> feat/auth
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message,
        });
      }
      next(error);
    }
  };
};
