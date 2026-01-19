import { Request, Response, NextFunction } from "express";
import {
  registerService,
  loginService,
  logoutService,
  getMeService,
  refreshTokenService,
  revokeTokenService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  verifyEmailService,
  resendVerificationService,
  deactivateUserService,
  activateUserService,
  deleteAccountService,
  softDeleteUserService,
} from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await logoutService({
      refreshToken: req.body?.refreshToken,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub as string;
    const result = await getMeService(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await refreshTokenService({
      refreshToken: req.body?.refreshToken,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const revokeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await revokeTokenService({
      refreshToken: req.body?.refreshToken,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await forgotPasswordService({
      email: req.body?.email,
      emailSubject: req.body?.emailSubject,
      emailTemplateKey: req.body?.emailTemplateKey,
      emailTemplateText: req.body?.emailTemplateText,
      emailLinkBase: req.body?.emailLinkBase,
      emailLinkQueryName: req.body?.emailLinkQueryName,
      emailLinkTemplateText: req.body?.emailLinkTemplateText,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await resetPasswordService({
      token: req.body?.token,
      newPassword: req.body?.newPassword,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.sub as string;

    const result = await changePasswordService({
      userId,
      currentPassword: req.body?.currentPassword,
      newPassword: req.body?.newPassword,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await verifyEmailService({ token: req.body?.token });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await resendVerificationService({
      email: req.body?.email,
      emailSubject: req.body?.emailSubject,
      emailTemplateKey: req.body?.emailTemplateKey,
      emailTemplateText: req.body?.emailTemplateText,
      emailLinkTemplateText: req.body?.emailLinkTemplateText,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deactivateUserService({ userId: req.body?.userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await activateUserService({ userId: req.body?.userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.sub as string;
    const result = await deleteAccountService({ userId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const softDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminEmail = (req as any).user?.email as string;
    if (!adminEmail) {
      throw { status: 401, message: "Email not found in token" };
    }
    const targetUserId = req.body?.userId;
    const result = await softDeleteUserService({
      adminEmail,
      targetUserId,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
