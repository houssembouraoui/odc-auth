// Complete fixed version of email.util.ts for the auth service
// Replace the existing email.util.ts file with this code

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

/**
 * Helper function to strip HTML tags for plain text fallback
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sends an email. Supports both plain text and HTML.
 * If html is provided, it will be sent as HTML email.
 * If only text is provided, it will be sent as plain text email.
 */
export async function sendMail(
  to: string,
  subject: string,
  text?: string,
  html?: string
) {
  try {
    const mailOptions: any = {
      from: ENV.EMAIL_USER,
      to,
      subject,
    };

    // If HTML is provided, use it; otherwise use text
    if (html) {
      mailOptions.html = html;
      // Also provide text version for email clients that don't support HTML
      mailOptions.text = text || stripHtml(html);
    } else if (text) {
      mailOptions.text = text;
    } else {
      throw new Error("Either text or html must be provided");
    }

    return await transporter.sendMail(mailOptions);
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

/**
 * Detects if a string contains HTML content
 */
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.startsWith("<!DOCTYPE html") ||
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    (trimmed.includes("<html") && trimmed.includes("</html>"))
  );
}

export async function sendTemplatedMail(params: {
  to: string;
  subject?: string;
  templateKey?: string; // key from default templates
  templateText?: string; // fully custom template (can be HTML or plain text)
  variables: Record<string, string | number | boolean>;
}) {
  const { to, subject, templateKey, templateText, variables } = params;
  const chosen =
    templateText ||
    (templateKey ? defaultTemplates[templateKey] : undefined) ||
    defaultTemplates.welcomeTempPassword;

  const rendered = renderTemplate(chosen, variables);
  const finalSubject = subject || "Your temporary password";

  // Detect if the template is HTML
  const isHtml = isHtmlContent(rendered);

  if (isHtml) {
    // Send as HTML email
    return sendMail(to, finalSubject, undefined, rendered);
  } else {
    // Send as plain text email
    return sendMail(to, finalSubject, rendered);
  }
}

export const EmailTemplates = defaultTemplates;
