import nodemailer from "nodemailer";
import { ENV } from "../config/env";

const transporter = nodemailer.createTransport({
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  secure: ENV.EMAIL_SECURE,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export async function sendMail(to: string, subject: string, text: string) {
  try {
    return await transporter.sendMail({ from: ENV.EMAIL_USER, to, subject, text });
  } catch (err) {
    console.error("Email send failed", err);
    throw err;
  }
}

type TemplateMap = Record<string, string>;

const defaultTemplates: TemplateMap = {
  welcomeTempPassword:
    "Hello {{nameOrEmail}},\n\nWelcome aboard! Your temporary password is: {{tempPassword}}\n\nPlease sign in and change it immediately from your account settings.{{actionUrl?}}\n\nThanks,\nODC Auth Team",
  passwordReset:
    "Hi {{nameOrEmail}},\n\nUse this token to reset your password: {{resetToken}}\nReset here: {{actionUrl}}\nIf you didn't request this, please ignore this email.",
  verifyEmail:
    "Hello {{nameOrEmail}},\n\nVerify your email using this token: {{verificationToken}}\nVerify here: {{actionUrl}}",
};

export function renderTemplate(
  template: string,
  variables: Record<string, string | number | boolean>
): string {
  // support optional block {{actionUrl?}} -> replaced with "\nLink: <url>" only when provided
  const withOptional = template.replace(
    /\{\{(\w+)\?\}\}/g,
    (_m, key: string) => {
      const val = variables[key];
      return val ? `\n${String(val)}` : "";
    }
  );
  return withOptional.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const k = String(key).trim();
    const val = variables[k];
    return val === undefined || val === null ? "" : String(val);
  });
}

export async function sendTemplatedMail(params: {
  to: string;
  subject?: string;
  templateKey?: string; // key from default templates
  templateText?: string; // fully custom template
  variables: Record<string, string | number | boolean>;
}) {
  const { to, subject, templateKey, templateText, variables } = params;
  const chosen =
    templateText ||
    (templateKey ? defaultTemplates[templateKey] : undefined) ||
    defaultTemplates.welcomeTempPassword;
  const text = renderTemplate(chosen, variables);
  const finalSubject = subject || "Your temporary password";
  return sendMail(to, finalSubject, text);
}

export const EmailTemplates = defaultTemplates;
