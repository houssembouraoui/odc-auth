"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
exports.loginService = loginService;
exports.logoutService = logoutService;
exports.getMeService = getMeService;
exports.refreshTokenService = refreshTokenService;
exports.revokeTokenService = revokeTokenService;
exports.forgotPasswordService = forgotPasswordService;
exports.resetPasswordService = resetPasswordService;
exports.changePasswordService = changePasswordService;
exports.verifyEmailService = verifyEmailService;
exports.resendVerificationService = resendVerificationService;
const user_repository_1 = require("../repositories/user.repository");
const hash_util_1 = require("../utils/hash.util");
const token_util_1 = require("../utils/token.util");
const email_util_1 = require("../utils/email.util");
async function registerService(input) {
    const existing = await (0, user_repository_1.getUserByEmail)(input.email);
    if (existing) {
        throw { status: 409, message: "Email already in use" };
    }
    const passwordHashed = await (0, hash_util_1.hashPassword)(input.password);
    const data = {
        email: input.email,
        password: passwordHashed,
        name: input.name,
        isVerified: false,
    };
    const user = await (0, user_repository_1.createUser)(data);
    const accessToken = (0, token_util_1.generateAccessToken)({ sub: user.id, email: user.email });
    const refreshToken = (0, token_util_1.generateRefreshToken)({ sub: user.id, email: user.email });
    return { user: sanitizeUser(user), accessToken, refreshToken };
}
async function loginService(input) {
    const user = await (0, user_repository_1.getUserByEmail)(input.email);
    if (!user) {
        throw { status: 401, message: "Invalid credentials" };
    }
    const ok = await (0, hash_util_1.comparePasswords)(input.password, user.password);
    if (!ok) {
        throw { status: 401, message: "Invalid credentials" };
    }
    const accessToken = (0, token_util_1.generateAccessToken)({ sub: user.id, email: user.email });
    const refreshToken = (0, token_util_1.generateRefreshToken)({ sub: user.id, email: user.email });
    return { user: sanitizeUser(user), accessToken, refreshToken };
}
async function logoutService(input) {
    // No token store; noop for now
    return { success: true };
}
async function getMeService(userId) {
    const user = await (0, user_repository_1.getUserById)(userId);
    if (!user)
        throw { status: 404, message: "User not found" };
    return sanitizeUser(user);
}
async function refreshTokenService(input) {
    try {
        const decoded = (0, token_util_1.verifyToken)(input.refreshToken, true);
        const userId = decoded.sub;
        const user = await (0, user_repository_1.getUserById)(userId);
        if (!user)
            throw new Error("User not found");
        const accessToken = (0, token_util_1.generateAccessToken)({ sub: user.id, email: user.email });
        return { accessToken };
    }
    catch {
        throw { status: 401, message: "Invalid refresh token" };
    }
}
async function revokeTokenService(_input) {
    // No token store; noop for now
    return { success: true };
}
async function forgotPasswordService(input) {
    const user = await (0, user_repository_1.getUserByEmail)(input.email);
    if (!user)
        return { success: true };
    const resetToken = (0, token_util_1.generateRefreshToken)({ sub: user.id }, "30m");
    await (0, user_repository_1.updateUser)(user.id, { resetToken });
    await (0, email_util_1.sendMail)(user.email, "Password Reset", `Use this token to reset your password: ${resetToken}`);
    return { success: true };
}
async function resetPasswordService(input) {
    try {
        const decoded = (0, token_util_1.verifyToken)(input.token, true);
        const userId = decoded.sub;
        const user = await (0, user_repository_1.getUserById)(userId);
        if (!user || user.resetToken !== input.token)
            throw new Error("Invalid token");
        const passwordHashed = await (0, hash_util_1.hashPassword)(input.newPassword);
        await (0, user_repository_1.updateUser)(user.id, { password: passwordHashed, resetToken: null });
        return { success: true };
    }
    catch {
        throw { status: 400, message: "Invalid or expired reset token" };
    }
}
async function changePasswordService(input) {
    const user = await (0, user_repository_1.getUserById)(input.userId);
    if (!user)
        throw { status: 404, message: "User not found" };
    const ok = await (0, hash_util_1.comparePasswords)(input.currentPassword, user.password);
    if (!ok)
        throw { status: 401, message: "Invalid current password" };
    const passwordHashed = await (0, hash_util_1.hashPassword)(input.newPassword);
    await (0, user_repository_1.updateUser)(user.id, { password: passwordHashed });
    return { success: true };
}
async function verifyEmailService(input) {
    try {
        const decoded = (0, token_util_1.verifyToken)(input.token);
        const userId = decoded.sub;
        const user = await (0, user_repository_1.getUserById)(userId);
        if (!user || user.verificationToken !== input.token)
            throw new Error("Invalid token");
        await (0, user_repository_1.updateUser)(user.id, { isVerified: true, verificationToken: null });
        return { success: true };
    }
    catch {
        throw { status: 400, message: "Invalid or expired verification token" };
    }
}
async function resendVerificationService(input) {
    const user = await (0, user_repository_1.getUserByEmail)(input.email);
    if (!user)
        return { success: true };
    const token = (0, token_util_1.generateAccessToken)({ sub: user.id }, "30m");
    await (0, user_repository_1.updateUser)(user.id, { verificationToken: token });
    await (0, email_util_1.sendMail)(user.email, "Verify your email", `Use this token to verify your email: ${token}`);
    return { success: true };
}
function sanitizeUser(user) {
    const { password, ...rest } = user;
    return rest;
}
