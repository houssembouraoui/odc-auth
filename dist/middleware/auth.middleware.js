"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const http_1 = require("http");
const token_util_1 = require("../utils/token.util");
const user_repository_1 = require("../repositories/user.repository");
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const status = 401;
        const statusText = http_1.STATUS_CODES[status] || "Unauthorized";
        return res.status(status).json({
            statusCode: status,
            error: statusText,
            message: "Missing access token",
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, token_util_1.verifyToken)(token);
        const userId = decoded.sub;
        // Check if user exists and is active
        try {
            const user = await (0, user_repository_1.getUserById)(userId);
            if (!user) {
                const status = 401;
                const statusText = http_1.STATUS_CODES[status] || "Unauthorized";
                return res.status(status).json({
                    statusCode: status,
                    error: statusText,
                    message: "User not found",
                    path: req.originalUrl,
                    method: req.method,
                    timestamp: new Date().toISOString(),
                });
            }
            if (!user.isActive) {
                const status = 403;
                const statusText = http_1.STATUS_CODES[status] || "Forbidden";
                return res.status(status).json({
                    statusCode: status,
                    error: statusText,
                    message: "User account is deactivated",
                    path: req.originalUrl,
                    method: req.method,
                    timestamp: new Date().toISOString(),
                });
            }
            req.user = decoded;
            next();
        }
        catch (dbErr) {
            // Database errors should be passed to error middleware
            next(dbErr);
        }
    }
    catch (err) {
        const status = 401;
        const statusText = http_1.STATUS_CODES[status] || "Unauthorized";
        return res.status(status).json({
            statusCode: status,
            error: statusText,
            message: "Invalid or expired token",
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    }
}
