import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "http";
import { verifyToken } from "../utils/token.util";
import { getUserById } from "../repositories/user.repository";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const status = 401;
    const statusText = STATUS_CODES[status] || "Unauthorized";
    return res.status(status).json({
      statusCode: status,
      error: statusText,
      message: "Missing access token",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    const userId = (decoded as any).sub as string;

    // Check if user exists and is active
    try {
      const user = await getUserById(userId);
      if (!user) {
        const status = 401;
        const statusText = STATUS_CODES[status] || "Unauthorized";
        return res.status(status).json({
          statusCode: status,
          error: statusText,
          message: "User not found",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        });
      }

      if (!user.isActive) {
        const status = 403;
        const statusText = STATUS_CODES[status] || "Forbidden";
        return res.status(status).json({
          statusCode: status,
          error: statusText,
          message: "User account is deactivated",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        });
      }

      (req as any).user = decoded;
      next();
    } catch (dbErr) {
      // Database errors should be passed to error middleware
      next(dbErr);
    }
  } catch (err: any) {
    const status = 401;
    const statusText = STATUS_CODES[status] || "Unauthorized";
    // Log the actual error for debugging (you can remove this in production)
    const errorMessage =
      err?.name === "TokenExpiredError"
        ? "Token has expired"
        : err?.name === "JsonWebTokenError"
        ? "Invalid token signature"
        : err?.message || "Invalid or expired token";
    return res.status(status).json({
      statusCode: status,
      error: statusText,
      message: errorMessage,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}
