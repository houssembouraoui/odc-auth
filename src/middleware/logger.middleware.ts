import morgan from "morgan";
import { Request, Response } from "express";

// Custom token for request ID (if needed)
morgan.token("id", (req: Request) => {
  return (req as any).id || "-";
});

// Custom format for development
const devFormat = ":method :url :status :response-time ms - :res[content-length]";

// Custom format for production
const prodFormat = ":remote-addr :method :url :status :response-time ms :res[content-length]";

// Determine format based on environment
const format = process.env.NODE_ENV === "production" ? prodFormat : devFormat;

// Create morgan middleware with custom format
export const loggerMiddleware = morgan(format, {
  skip: (req: Request, res: Response) => {
    // Skip logging for health checks in production (optional)
    return process.env.NODE_ENV === "production" && req.url === "/health";
  },
});

