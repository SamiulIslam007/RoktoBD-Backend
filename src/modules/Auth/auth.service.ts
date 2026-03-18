import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { BloodGroup } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import type {
  SendOtpBody,
  RegisterIndividualBody,
  RegisterHospitalBody,
  LoginBody,
} from './auth.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'roktobd-secret';
const ACCESS_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 10;

async function verifyOtp(phone: string, otp: string) {
  const devOtp = process.env.DEV_OTP;
  const isDevBypass =
    process.env.NODE_ENV !== 'production' && devOtp && otp === devOtp;

  if (!isDevBypass) {
    const record = await prisma.otpVerification.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    await prisma.otpVerification.deleteMany({ where: { phone } });
  }
}

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

  async registerIndividual(body: RegisterIndividualBody) {
    await verifyOtp(body.phone, body.otp);

    const existingByPhone = await prisma.user.findUnique({
      where: { phone: body.phone },
    });
    if (existingByPhone) {
      throw new AppError(409, 'Phone number already registered');
    }

    const existingByEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingByEmail) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: 'DONOR',
      },
    });

    await prisma.donor.create({
      data: {
        userId: user.id,
        bloodGroup: body.bloodGroup as BloodGroup,
        districtId: body.districtId,
        cityId: body.cityId,
        dateOfBirth: body.dateOfBirth,
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

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
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async registerHospital(body: RegisterHospitalBody) {
    await verifyOtp(body.phone, body.otp);

    const existingByPhone = await prisma.user.findUnique({
      where: { phone: body.phone },
    });
    if (existingByPhone) {
      throw new AppError(409, 'Phone number already registered');
    }

    const existingByEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingByEmail) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        name: body.contactPerson,
        role: 'HOSPITAL',
      },
    });

    await prisma.hospital.create({
      data: {
        userId: user.id,
        hospitalName: body.hospitalName,
        contactPerson: body.contactPerson,
        address: body.address,
        districtId: body.districtId,
        cityId: body.cityId,
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

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
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async login(body: LoginBody) {
    const user = await prisma.user.findUnique({
      where: { phone: body.phone },
    });

    if (!user) {
      throw new AppError(401, 'Invalid phone or password');
    }

    if (!user.password) {
      throw new AppError(400, 'Account was created without password. Please use OTP verification.');
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      throw new AppError(401, 'Invalid phone or password');
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

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
        email: user.email,
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
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new AppError(404, 'User not found');
    return user;
  },

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    return { accessToken };
  },

  async logout(token: string | undefined) {
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }
    return { message: 'Logged out successfully' };
  },
};
