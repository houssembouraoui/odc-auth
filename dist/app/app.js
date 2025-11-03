"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../routes/auth.routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api/auth", auth_routes_1.authRouter);
