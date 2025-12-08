import express from "express";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { registerRoutes } from "./routes";

export const app = express();
app.use(express.json());
app.use(loggerMiddleware);
registerRoutes(app);
