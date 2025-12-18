import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "http";
import { verifyToken } from "../utils/token.util";

export function authMiddleware(
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
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (err) {
    const status = 401;
    const statusText = STATUS_CODES[status] || "Unauthorized";
    return res.status(status).json({
      statusCode: status,
      error: statusText,
      message: "Invalid or expired token",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}
