import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export function generateAccessToken(payload: any, expiresIn = "15m") {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn });
}
export function generateRefreshToken(payload: any, expiresIn = "7d") {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn });
}
export function verifyToken(token: string, isRefresh = false) {
  const secret = isRefresh ? ENV.JWT_REFRESH_SECRET : ENV.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
}
