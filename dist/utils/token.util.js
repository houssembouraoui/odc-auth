"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function requireSecret(value, name) {
    if (!value) {
        throw new Error(`${name} is not set`);
    }
    return value;
}
function generateAccessToken(payload, expiresIn = "15m") {
    const secret = requireSecret(env_1.ENV.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET");
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
function generateRefreshToken(payload, expiresIn = "7d") {
    const secret = requireSecret(env_1.ENV.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
function verifyToken(token, isRefresh = false) {
    const secret = requireSecret(isRefresh ? env_1.ENV.JWT_REFRESH_SECRET : env_1.ENV.JWT_ACCESS_SECRET, isRefresh ? "JWT_REFRESH_SECRET" : "JWT_ACCESS_SECRET");
    return jsonwebtoken_1.default.verify(token, secret);
}
