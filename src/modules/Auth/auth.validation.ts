import { z } from 'zod';

const phoneSchema = z
  .string()
  .length(11, 'Bangladesh phone number must be exactly 11 digits')
  .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number (must start with 01)');

const otpSchema = z.string().length(6, 'OTP must be 6 digits');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(1, 'Name is required');
const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

const bloodGroupValues = [
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
] as const;
const bloodGroupSchema = z.enum(bloodGroupValues);

const dateOfBirthSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format (use YYYY-MM-DD)')
  .transform((val) => new Date(val));

const districtIdSchema = z.string().uuid('Invalid district ID');
const cityIdSchema = z.string().uuid('Invalid city ID').optional();

export const sendOtpSchema = z
  .object({
    body: z.object({
      phone: phoneSchema,
    }),
  })
  .passthrough();

export const registerIndividualSchema = z
  .object({
    body: z.object({
      phone: phoneSchema,
      otp: otpSchema,
      email: emailSchema,
      password: passwordSchema,
      name: nameSchema,
      bloodGroup: bloodGroupSchema,
      dateOfBirth: dateOfBirthSchema,
      districtId: districtIdSchema,
      cityId: cityIdSchema,
    }),
  })
  .passthrough();

export const registerHospitalSchema = z
  .object({
    body: z.object({
      phone: phoneSchema,
      otp: otpSchema,
      email: emailSchema,
      password: passwordSchema,
      hospitalName: z.string().min(1, 'Hospital name is required'),
      contactPerson: z.string().min(1, 'Contact person is required'),
      address: z.string().optional(),
      districtId: districtIdSchema.optional(),
      cityId: cityIdSchema,
    }),
  })
  .passthrough();

export const loginSchema = z
  .object({
    body: z.object({
      phone: phoneSchema,
      password: passwordSchema,
    }),
  })
  .passthrough();

export type SendOtpInput = z.infer<typeof sendOtpSchema>['body'];
export type RegisterIndividualInput = z.infer<typeof registerIndividualSchema>['body'];
export type RegisterHospitalInput = z.infer<typeof registerHospitalSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
