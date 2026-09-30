import { z } from 'zod';

export const emailFormSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});
export type EmailForm = z.infer<typeof emailFormSchema>;

export const otpFormSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code'),
});
export type OtpForm = z.infer<typeof otpFormSchema>;
