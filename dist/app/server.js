"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const error_middleware_1 = require("../middleware/error.middleware");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const server = (0, express_1.default)();
server.use(app_1.app);
server.use(error_middleware_1.errorMiddleware);
server.listen(PORT, () => {
    console.log(`ODC Auth server running on :${PORT}`);
});
