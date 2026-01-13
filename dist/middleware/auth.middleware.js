"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const http_1 = require("http");
const token_util_1 = require("../utils/token.util");
function authMiddleware(req, res, next) {
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
        const user = (0, token_util_1.verifyToken)(token);
        req.user = user;
        next();
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
