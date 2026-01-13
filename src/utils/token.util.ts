import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env";

function requireSecret(value: string | undefined, name: string): Secret {
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value as Secret;
}

export function generateAccessToken(
  payload: string | object | Buffer,
  expiresIn?: SignOptions["expiresIn"]
): string {
  const secret = requireSecret(ENV.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET");
  const options: SignOptions = {
    expiresIn: (expiresIn ||
      ENV.JWT_ACCESS_TOKEN_EXPIRES_IN) as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(
  payload: string | object | Buffer,
  expiresIn?: SignOptions["expiresIn"]
): string {
  const secret = requireSecret(ENV.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");
  const options: SignOptions = {
    expiresIn: (expiresIn ||
      ENV.JWT_REFRESH_TOKEN_EXPIRES_IN) as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(
  token: string,
  isRefresh = false
): string | JwtPayload {
  const secret = requireSecret(
    isRefresh ? ENV.JWT_REFRESH_SECRET : ENV.JWT_ACCESS_SECRET,
    isRefresh ? "JWT_REFRESH_SECRET" : "JWT_ACCESS_SECRET"
  );
  return jwt.verify(token, secret);
}
