import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import type { SendOtpBody, VerifyOtpBody } from './auth.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'roktobd-secret';
const ACCESS_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY = '7d';

export const AuthService = {
  async sendOtp(body: SendOtpBody) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otpVerification.deleteMany({ where: { phone: body.phone } });
    await prisma.otpVerification.create({
      data: { phone: body.phone, otp, expiresAt },
    });

    return { success: true };
  },

  async verifyOtp(body: VerifyOtpBody) {
    const record = await prisma.otpVerification.findFirst({
      where: { phone: body.phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!record || record.otp !== body.otp || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    await prisma.otpVerification.deleteMany({ where: { phone: body.phone } });

    let user = await prisma.user.findUnique({ where: { phone: body.phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: body.phone,
          name: body.phone,
          role: 'REQUESTER',
        },
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    return { accessToken };
  },

  logout() {
    return { message: 'Logged out successfully' };
  },
};
