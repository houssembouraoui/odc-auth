import { z } from "zod";

const emailField = z.string().trim().email();
const nonEmptyString = z.string().trim().min(1);
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters");

const templateKeyEnum = z.enum([
  "welcomeTempPassword",
  "passwordReset",
  "verifyEmail",
]);

export const registerSchema = z.object({
  email: emailField,
  password: z.string().trim().min(8).optional(),
  name: z.string().trim().min(1).optional(),
  emailSubject: z.string().optional(),
  emailTemplateKey: templateKeyEnum.optional(),
  emailTemplateText: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: nonEmptyString,
});

export const revokeTokenSchema = z.object({
  refreshToken: nonEmptyString,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
  emailSubject: z.string().optional(),
  emailTemplateKey: templateKeyEnum.optional(),
  emailTemplateText: z.string().optional(),
  emailLinkBase: z.string().url().optional(),
  emailLinkQueryName: z.string().optional(),
  emailLinkTemplateText: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: nonEmptyString,
  newPassword: passwordField,
});

export const changePasswordSchema = z.object({
  currentPassword: passwordField,
  newPassword: passwordField,
});

export const verifyEmailSchema = z.object({
  token: nonEmptyString,
});

export const resendVerificationSchema = z.object({
  email: emailField,
  emailSubject: z.string().optional(),
  emailTemplateKey: templateKeyEnum.optional(),
  emailTemplateText: z.string().optional(),
  emailLinkBase: z.string().url().optional(),
  emailLinkQueryName: z.string().optional(),
  emailLinkTemplateText: z.string().optional(),
});

export const userActivationSchema = z.object({
  userId: z.string().trim().uuid(),
});

export const deleteAccountSchema = z.object({
  // No body required for self-delete, but we'll validate if provided
}).passthrough();

export const softDeleteUserSchema = z.object({
  userId: z.string().trim().uuid(),
});
