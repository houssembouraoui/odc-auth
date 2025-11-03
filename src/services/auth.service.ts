import { getUserByEmail, createUser, updateUser, getUserById } from "../repositories/user.repository";
import { hashPassword, comparePasswords } from "../utils/hash.util";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.util";
import { sendMail } from "../utils/email.util";
import { Prisma } from "@prisma/client";

export async function registerService(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    throw { status: 409, message: "Email already in use" };
  }
  const passwordHashed = await hashPassword(input.password);
  const data: Prisma.UserCreateInput = {
    email: input.email,
    password: passwordHashed,
    name: input.name,
    isVerified: false,
  };
  const user = await createUser(data);
  const accessToken = generateAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });
  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function loginService(input: { email: string; password: string }) {
  const user = await getUserByEmail(input.email);
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const ok = await comparePasswords(input.password, user.password);
  if (!ok) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const accessToken = generateAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ sub: user.id, email: user.email });
  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function logoutService(input: { refreshToken?: string }) {
  // No token store; noop for now
  return { success: true };
}

export async function getMeService(userId: string) {
  const user = await getUserById(userId);
  if (!user) throw { status: 404, message: "User not found" };
  return sanitizeUser(user);
}

export async function refreshTokenService(input: { refreshToken: string }) {
  try {
    const decoded = verifyToken(input.refreshToken, true) as any;
    const userId = decoded.sub as string;
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");
    const accessToken = generateAccessToken({ sub: user.id, email: user.email });
    return { accessToken };
  } catch {
    throw { status: 401, message: "Invalid refresh token" };
  }
}

export async function revokeTokenService(_input: { refreshToken: string }) {
  // No token store; noop for now
  return { success: true };
}

export async function forgotPasswordService(input: { email: string }) {
  const user = await getUserByEmail(input.email);
  if (!user) return { success: true };
  const resetToken = generateRefreshToken({ sub: user.id }, "30m");
  await updateUser(user.id, { resetToken });
  await sendMail(user.email, "Password Reset", `Use this token to reset your password: ${resetToken}`);
  return { success: true };
}

export async function resetPasswordService(input: { token: string; newPassword: string }) {
  try {
    const decoded = verifyToken(input.token, true) as any;
    const userId = decoded.sub as string;
    const user = await getUserById(userId);
    if (!user || user.resetToken !== input.token) throw new Error("Invalid token");
    const passwordHashed = await hashPassword(input.newPassword);
    await updateUser(user.id, { password: passwordHashed, resetToken: null });
    return { success: true };
  } catch {
    throw { status: 400, message: "Invalid or expired reset token" };
  }
}

export async function changePasswordService(input: { userId: string; currentPassword: string; newPassword: string }) {
  const user = await getUserById(input.userId);
  if (!user) throw { status: 404, message: "User not found" };
  const ok = await comparePasswords(input.currentPassword, user.password);
  if (!ok) throw { status: 401, message: "Invalid current password" };
  const passwordHashed = await hashPassword(input.newPassword);
  await updateUser(user.id, { password: passwordHashed });
  return { success: true };
}

export async function verifyEmailService(input: { token: string }) {
  try {
    const decoded = verifyToken(input.token) as any;
    const userId = decoded.sub as string;
    const user = await getUserById(userId);
    if (!user || user.verificationToken !== input.token) throw new Error("Invalid token");
    await updateUser(user.id, { isVerified: true, verificationToken: null });
    return { success: true };
  } catch {
    throw { status: 400, message: "Invalid or expired verification token" };
  }
}

export async function resendVerificationService(input: { email: string }) {
  const user = await getUserByEmail(input.email);
  if (!user) return { success: true };
  const token = generateAccessToken({ sub: user.id }, "30m");
  await updateUser(user.id, { verificationToken: token });
  await sendMail(user.email, "Verify your email", `Use this token to verify your email: ${token}`);
  return { success: true };
}

function sanitizeUser<T extends { password?: string | null }>(user: T) {
  const { password, ...rest } = user as any;
  return rest;
}
