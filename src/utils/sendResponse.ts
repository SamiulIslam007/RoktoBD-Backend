import { Response } from 'express';

interface SendResponseOptions<T = unknown> {
  statusCode: number;
  success?: boolean;
  message: string;
  data?: T;
}

export function sendResponse<T = unknown>(
  res: Response,
  options: SendResponseOptions<T>
): void {
  const { statusCode, message, data } = options;
  const success = options.success ?? (statusCode >= 200 && statusCode < 300);

  try {
<<<<<<< HEAD
    const responseBody: ApiResponse<T> = {
=======
    const responseBody = {
>>>>>>> feat/auth
      success,
      message,
      ...(data !== undefined && { data }),
    };

    res.status(statusCode).json(responseBody);
  } catch (error) {
    try {
      res.status(statusCode).send(
        JSON.stringify({
          success,
          message,
          ...(data !== undefined && { data }),
        })
      );
    } catch (fallbackError) {
      console.error('sendResponse failed:', fallbackError);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}

export default sendResponse;
