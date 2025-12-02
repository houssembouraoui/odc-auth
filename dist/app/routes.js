"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_routes_1 = require("../routes/auth.routes");
const sync_routes_1 = require("../routes/sync.routes");
function registerRoutes(app) {
    app.use("/api/auth", auth_routes_1.authRouter);
    app.use("/api/sync", sync_routes_1.syncRouter);
}
