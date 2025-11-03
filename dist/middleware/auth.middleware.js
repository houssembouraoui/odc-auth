"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const token_util_1 = require("../utils/token.util");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing access token" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = (0, token_util_1.verifyToken)(token);
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
