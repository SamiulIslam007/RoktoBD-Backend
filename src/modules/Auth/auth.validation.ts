import { z } from 'zod';

const phoneSchema = z
  .string()
  .length(11, 'Bangladesh phone number must be exactly 11 digits')
  .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number (must start with 01)');
const otpSchema = z.string().length(6, 'OTP must be 6 digits');

export const sendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
  }),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
