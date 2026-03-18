import { z } from 'zod';

const phoneSchema = z
  .string()
  .length(11, 'Bangladesh phone number must be exactly 11 digits')
  .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number (must start with 01)');
const otpSchema = z.string().length(6, 'OTP must be 6 digits');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(1, 'Name is required');

export const sendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const registerSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
    password: passwordSchema,
    name: nameSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    password: passwordSchema,
  }),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
