import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email');

// Keep min length in sync with minimum_password_length in supabase/config.toml.
const newPassword = z
  .string()
  .min(8, 'Use at least 8 characters')
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/\d/, 'Include at least one number');

export const signInFormSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});
export type SignInForm = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z
  .object({
    email,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords don’t match',
    path: ['confirmPassword'],
  });
export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const otpFormSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});
export type OtpForm = z.infer<typeof otpFormSchema>;
