import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE_7_DAYS } from './auth.constant';

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.sendOtp(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OTP sent successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    const { refreshToken, ...responseData } = result;

    res.cookie(AUTH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE_7_DAYS,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Registration successful',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    const { refreshToken, ...responseData } = result;

    res.cookie(AUTH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE_7_DAYS,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logged in successfully',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const result = await AuthService.getMe(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Refresh token is missing. Please log in again.',
      });
      return;
    }

    const result = await AuthService.refreshToken(token);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Access token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const result = AuthService.logout();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  sendOtp,
  register,
  login,
  getMe,
  refreshToken,
  logout,
};
