import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "http";

type ErrorDetails = Record<string, any> | undefined;

/**
 * Global error handler.
 *
 * Goal: always return a structured, developer-friendly error payload that
 * clearly explains the cause instead of only exposing the HTTP status code.
 *
 * Example response:
 * {
 *   "statusCode": 400,
 *   "error": "Bad Request",
 *   "message": "Email already in use",
 *   "path": "/api/auth/register",
 *   "method": "POST",
 *   "timestamp": "2025-01-01T12:00:00.000Z",
 *   "details": { ...optional extra data... }
 * }
 */
export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status =
    typeof err?.status === "number" && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  const statusText = STATUS_CODES[status] || "Error";

  // Prefer the explicit error message coming from services/controllers.
  // For unknown errors, avoid leaking internals and fall back to a generic message.
  const baseMessage: string =
    typeof err?.message === "string" && err.message.trim().length > 0
      ? err.message
      : status >= 500
      ? "An unexpected error occurred on the auth service."
      : statusText;

  const details: ErrorDetails =
    typeof err?.details === "object" && err.details !== null
      ? err.details
      : undefined;

  const payload: Record<string, any> = {
    statusCode: status,
    error: statusText,
    message: baseMessage,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    payload.details = details;
  }

  if (err?.code && typeof err.code === "string") {
    payload.code = err.code;
  }

  // In non-production, expose stack traces for easier debugging of unexpected errors.
  if (process.env.NODE_ENV !== "production" && status >= 500 && err?.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
