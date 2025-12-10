import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { ENV } from "../config/env";

// Initialize Brevo API client
const transactionalEmailsApi = new TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  ENV.BREVO_API_KEY
);

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
    if (!text && !html) {
      throw new Error("Either text or html must be provided");
    }

    // Parse sender email and name
    const senderEmail = ENV.EMAIL_FROM;
    const senderName = ENV.EMAIL_FROM_NAME || "ODC Auth";

    // Build the email message
    const sendSmtpEmail: SendSmtpEmail = {
      to: [{ email: to }],
      subject,
      sender: {
        email: senderEmail,
        name: senderName,
      },
    };

    // If HTML is provided, use it; otherwise use text
    if (html) {
      sendSmtpEmail.htmlContent = html;
      // Also provide text version for email clients that don't support HTML
      sendSmtpEmail.textContent = text || stripHtml(html);
    } else if (text) {
      sendSmtpEmail.textContent = text;
    }

    // Add timeout wrapper to prevent indefinite hanging
    const sendPromise = transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Email send timeout: Request took longer than 30 seconds"));
      }, 30000); // 30 second overall timeout
    });

    const result = await Promise.race([sendPromise, timeoutPromise]);
    return result;
  } catch (err: any) {
    console.error("Email send failed", err);
    // Extract error message from Brevo API response if available
    if (err?.response?.body) {
      throw new Error(
        `Email send failed: ${JSON.stringify(err.response.body)}`
      );
    }
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

/**
 * Verify the email API connection
 * Useful for debugging email configuration issues
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    // Brevo doesn't have a direct verify method, so we'll test by sending a minimal request
    // For now, we'll just check if the API key is set
    if (!ENV.BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not set");
      return false;
    }
    console.log("Brevo API key is configured");
    return true;
  } catch (error) {
    console.error("Email API connection verification failed:", error);
    return false;
  }
}
