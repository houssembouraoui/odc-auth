"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userActivationSchema = exports.resendVerificationSchema = exports.verifyEmailSchema = exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.revokeTokenSchema = exports.refreshTokenSchema = exports.logoutSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const emailField = zod_1.z.string().trim().email();
const nonEmptyString = zod_1.z.string().trim().min(1);
const passwordField = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters");
const templateKeyEnum = zod_1.z.enum([
    "welcomeTempPassword",
    "passwordReset",
    "verifyEmail",
]);
exports.registerSchema = zod_1.z.object({
    email: emailField,
    password: zod_1.z.string().trim().min(8).optional(),
    name: zod_1.z.string().trim().min(1).optional(),
    emailSubject: zod_1.z.string().optional(),
    emailTemplateKey: templateKeyEnum.optional(),
    emailTemplateText: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: emailField,
    password: passwordField,
});
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().optional(),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: nonEmptyString,
});
exports.revokeTokenSchema = zod_1.z.object({
    refreshToken: nonEmptyString,
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: emailField,
    emailSubject: zod_1.z.string().optional(),
    emailTemplateKey: templateKeyEnum.optional(),
    emailTemplateText: zod_1.z.string().optional(),
    emailLinkBase: zod_1.z.string().url().optional(),
    emailLinkQueryName: zod_1.z.string().optional(),
    emailLinkTemplateText: zod_1.z.string().optional(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: nonEmptyString,
    newPassword: passwordField,
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: passwordField,
    newPassword: passwordField,
});
exports.verifyEmailSchema = zod_1.z.object({
    token: nonEmptyString,
});
exports.resendVerificationSchema = zod_1.z.object({
    email: emailField,
    emailSubject: zod_1.z.string().optional(),
    emailTemplateKey: templateKeyEnum.optional(),
    emailTemplateText: zod_1.z.string().optional(),
    emailLinkBase: zod_1.z.string().url().optional(),
    emailLinkQueryName: zod_1.z.string().optional(),
    emailLinkTemplateText: zod_1.z.string().optional(),
});
exports.userActivationSchema = zod_1.z.object({
    userId: zod_1.z.string().trim().uuid(),
});
