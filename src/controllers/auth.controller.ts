import { Request, Response, NextFunction } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("register stub");
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("login stub");
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("logout stub");
};
export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.send("me stub");
};
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("refresh token stub");
};
export const revokeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("revoke token stub");
};
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("forgot password stub");
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("reset password stub");
};
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("change password stub");
};
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("verify email stub");
};
export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("resend verification stub");
};
