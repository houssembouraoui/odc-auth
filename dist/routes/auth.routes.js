"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth.controller"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_schemas_1 = require("../validators/auth.schemas");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", (0, validate_middleware_1.validate)({ body: auth_schemas_1.registerSchema }), authController.register);
exports.authRouter.post("/login", (0, validate_middleware_1.validate)({ body: auth_schemas_1.loginSchema }), authController.login);
exports.authRouter.post("/logout", (0, validate_middleware_1.validate)({ body: auth_schemas_1.logoutSchema }), authController.logout);
exports.authRouter.get("/me", auth_middleware_1.authMiddleware, authController.me);
exports.authRouter.post("/refresh", (0, validate_middleware_1.validate)({ body: auth_schemas_1.refreshTokenSchema }), authController.refreshToken);
exports.authRouter.post("/token/revoke", (0, validate_middleware_1.validate)({ body: auth_schemas_1.revokeTokenSchema }), authController.revokeToken);
exports.authRouter.post("/password/forgot", (0, validate_middleware_1.validate)({ body: auth_schemas_1.forgotPasswordSchema }), authController.forgotPassword);
exports.authRouter.post("/password/reset", (0, validate_middleware_1.validate)({ body: auth_schemas_1.resetPasswordSchema }), authController.resetPassword);
exports.authRouter.post("/password/change", (0, validate_middleware_1.validate)({ body: auth_schemas_1.changePasswordSchema }), auth_middleware_1.authMiddleware, authController.changePassword);
exports.authRouter.post("/verify-email", (0, validate_middleware_1.validate)({ body: auth_schemas_1.verifyEmailSchema }), authController.verifyEmail);
exports.authRouter.post("/resend-verification", (0, validate_middleware_1.validate)({ body: auth_schemas_1.resendVerificationSchema }), authController.resendVerification);
exports.authRouter.post("/users/deactivate", (0, validate_middleware_1.validate)({ body: auth_schemas_1.userActivationSchema }), auth_middleware_1.authMiddleware, authController.deactivateUser);
exports.authRouter.post("/users/activate", (0, validate_middleware_1.validate)({ body: auth_schemas_1.userActivationSchema }), auth_middleware_1.authMiddleware, authController.activateUser);
exports.authRouter.delete("/account", (0, validate_middleware_1.validate)({ body: auth_schemas_1.deleteAccountSchema }), auth_middleware_1.authMiddleware, authController.deleteAccount);
exports.authRouter.post("/users/soft-delete", (0, validate_middleware_1.validate)({ body: auth_schemas_1.softDeleteUserSchema }), auth_middleware_1.authMiddleware, authController.softDeleteUser);
