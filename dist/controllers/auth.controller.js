"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.verifyEmail = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.revokeToken = exports.refreshToken = exports.me = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.registerService)(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.loginService)(req.body);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.logoutService)({
            refreshToken: req.body?.refreshToken,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
const me = async (req, res, next) => {
    try {
        const userId = req.user?.sub;
        const result = await (0, auth_service_1.getMeService)(userId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
const refreshToken = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.refreshTokenService)({
            refreshToken: req.body?.refreshToken,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
const revokeToken = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.revokeTokenService)({
            refreshToken: req.body?.refreshToken,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.revokeToken = revokeToken;
const forgotPassword = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.forgotPasswordService)({ email: req.body?.email });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.resetPasswordService)({
            token: req.body?.token,
            newPassword: req.body?.newPassword,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res, next) => {
    try {
        const userId = req.user?.sub;
        const result = await (0, auth_service_1.changePasswordService)({
            userId,
            currentPassword: req.body?.currentPassword,
            newPassword: req.body?.newPassword,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.changePassword = changePassword;
const verifyEmail = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.verifyEmailService)({ token: req.body?.token });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.verifyEmail = verifyEmail;
const resendVerification = async (req, res, next) => {
    try {
        const result = await (0, auth_service_1.resendVerificationService)({ email: req.body?.email });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.resendVerification = resendVerification;
