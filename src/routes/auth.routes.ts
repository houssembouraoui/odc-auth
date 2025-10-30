import { Router } from "express";
import * as authController from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authController.me);

authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/token/revoke", authController.revokeToken);

authRouter.post("/password/forgot", authController.forgotPassword);
authRouter.post("/password/reset", authController.resetPassword);
authRouter.post("/password/change", authController.changePassword);

authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/resend-verification", authController.resendVerification);
