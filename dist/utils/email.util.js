"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = void 0;
exports.sendMail = sendMail;
exports.renderTemplate = renderTemplate;
exports.sendTemplatedMail = sendTemplatedMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.ENV.EMAIL_HOST,
    port: env_1.ENV.EMAIL_PORT,
    secure: env_1.ENV.EMAIL_SECURE,
    auth: {
        user: env_1.ENV.EMAIL_USER,
        pass: env_1.ENV.EMAIL_PASS,
    },
});
async function sendMail(to, subject, text) {
    try {
        return await transporter.sendMail({ from: env_1.ENV.EMAIL_USER, to, subject, text });
    }
    catch (err) {
        console.error("Email send failed", err);
        throw err;
    }
}
const defaultTemplates = {
    welcomeTempPassword: "Hello {{nameOrEmail}},\n\nWelcome aboard! Your temporary password is: {{tempPassword}}\n\nPlease sign in and change it immediately from your account settings.{{actionUrl?}}\n\nThanks,\nODC Auth Team",
    passwordReset: "Hi {{nameOrEmail}},\n\nUse this token to reset your password: {{resetToken}}\nReset here: {{actionUrl}}\nIf you didn't request this, please ignore this email.",
    verifyEmail: "Hello {{nameOrEmail}},\n\nVerify your email using this token: {{verificationToken}}\nVerify here: {{actionUrl}}",
};
function renderTemplate(template, variables) {
    // support optional block {{actionUrl?}} -> replaced with "\nLink: <url>" only when provided
    const withOptional = template.replace(/\{\{(\w+)\?\}\}/g, (_m, key) => {
        const val = variables[key];
        return val ? `\n${String(val)}` : "";
    });
    return withOptional.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const k = String(key).trim();
        const val = variables[k];
        return val === undefined || val === null ? "" : String(val);
    });
}
async function sendTemplatedMail(params) {
    const { to, subject, templateKey, templateText, variables } = params;
    const chosen = templateText ||
        (templateKey ? defaultTemplates[templateKey] : undefined) ||
        defaultTemplates.welcomeTempPassword;
    const text = renderTemplate(chosen, variables);
    const finalSubject = subject || "Your temporary password";
    return sendMail(to, finalSubject, text);
}
exports.EmailTemplates = defaultTemplates;
