import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.util";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing access token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
