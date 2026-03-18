import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface SendResponseOptions<T = unknown> {
  res: Response;
  statusCode: number;
  message: string;
  data?: T;
}

export function sendResponse<T = unknown>(
  options: SendResponseOptions<T>
): void {
  const { res, statusCode, message, data } = options;

  try {
    const responseBody: ApiResponse<T> = {
      success: statusCode >= 200 && statusCode < 300,
      message,
      ...(data !== undefined && { data }),
    };

    res.status(statusCode).json(responseBody);
  } catch (error) {
    try {
      res.status(statusCode).send(
        JSON.stringify({
          success: statusCode >= 200 && statusCode < 300,
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
