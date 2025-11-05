import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  revokeTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/auth.schemas";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  authController.register
);
authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login
);
authRouter.post(
  "/logout",
  validate({ body: logoutSchema }),
  authController.logout
);
authRouter.get("/me", authMiddleware, authController.me);

authRouter.post(
  "/refresh",
  validate({ body: refreshTokenSchema }),
  authController.refreshToken
);
authRouter.post(
  "/token/revoke",
  validate({ body: revokeTokenSchema }),
  authController.revokeToken
);

authRouter.post(
  "/password/forgot",
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword
);
authRouter.post(
  "/password/reset",
  validate({ body: resetPasswordSchema }),
  authController.resetPassword
);
authRouter.post(
  "/password/change",
  validate({ body: changePasswordSchema }),
  authMiddleware,
  authController.changePassword
);

authRouter.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  authController.verifyEmail
);
authRouter.post(
  "/resend-verification",
  validate({ body: resendVerificationSchema }),
  authController.resendVerification
);
