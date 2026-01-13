import { ENV } from "../config/env";

/**
 * Check if an email belongs to an admin user
 */
export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return ENV.ADMIN_EMAILS.includes(normalizedEmail);
}

