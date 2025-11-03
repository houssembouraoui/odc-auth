"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_routes_1 = require("../routes/auth.routes");
function registerRoutes(app) {
    app.use("/api/auth", auth_routes_1.authRouter);
}
