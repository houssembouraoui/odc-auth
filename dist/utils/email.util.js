"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = void 0;
exports.sendMail = sendMail;
exports.renderTemplate = renderTemplate;
exports.sendTemplatedMail = sendTemplatedMail;
exports.verifyEmailConnection = verifyEmailConnection;
const brevo_1 = require("@getbrevo/brevo");
const env_1 = require("../config/env");
// Initialize Brevo API client
const transactionalEmailsApi = new brevo_1.TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(brevo_1.TransactionalEmailsApiApiKeys.apiKey, env_1.ENV.BREVO_API_KEY);
/**
 * Helper function to strip HTML tags for plain text fallback
 */
function stripHtml(html) {
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
async function sendMail(to, subject, text, html) {
    try {
        if (!text && !html) {
            throw new Error("Either text or html must be provided");
        }
        // Parse sender email and name
        const senderEmail = env_1.ENV.EMAIL_FROM;
        const senderName = env_1.ENV.EMAIL_FROM_NAME || "ODC Auth";
        // Build the email message
        const sendSmtpEmail = {
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
        }
        else if (text) {
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
    }
    catch (err) {
        console.error("Email send failed", err);
        // Extract error message from Brevo API response if available
        if (err?.response?.body) {
            throw new Error(`Email send failed: ${JSON.stringify(err.response.body)}`);
        }
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
/**
 * Detects if a string contains HTML content
 */
function isHtmlContent(content) {
    const trimmed = content.trim();
    return (trimmed.startsWith("<!DOCTYPE html") ||
        trimmed.startsWith("<!doctype html") ||
        trimmed.startsWith("<html") ||
        (trimmed.includes("<html") && trimmed.includes("</html>")));
}
async function sendTemplatedMail(params) {
    const { to, subject, templateKey, templateText, variables } = params;
    const chosen = templateText ||
        (templateKey ? defaultTemplates[templateKey] : undefined) ||
        defaultTemplates.welcomeTempPassword;
    const rendered = renderTemplate(chosen, variables);
    const finalSubject = subject || "Your temporary password";
    // Detect if the template is HTML
    const isHtml = isHtmlContent(rendered);
    if (isHtml) {
        // Send as HTML email
        return sendMail(to, finalSubject, undefined, rendered);
    }
    else {
        // Send as plain text email
        return sendMail(to, finalSubject, rendered);
    }
}
exports.EmailTemplates = defaultTemplates;
/**
 * Verify the email API connection
 * Useful for debugging email configuration issues
 */
async function verifyEmailConnection() {
    try {
        // Brevo doesn't have a direct verify method, so we'll test by sending a minimal request
        // For now, we'll just check if the API key is set
        if (!env_1.ENV.BREVO_API_KEY) {
            console.error("BREVO_API_KEY is not set");
            return false;
        }
        console.log("Brevo API key is configured");
        return true;
    }
    catch (error) {
        console.error("Email API connection verification failed:", error);
        return false;
    }
}
