import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import sendResponse from '../utils/sendResponse';

interface RequestData {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

export const validateRequest = (schema: z.ZodType<RequestData>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as RequestData;
      if (parsed.body) req.body = parsed.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: { message?: string }) => e.message).filter(Boolean).join(', ') || 'Validation failed';
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
