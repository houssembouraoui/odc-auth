import express from "express";
import { authRouter } from "../routes/auth.routes";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { syncRouter } from "../routes/sync.routes";
import { healthRouter } from "../routes/health.routes";

export const app = express();
app.use(express.json());
app.use(loggerMiddleware);
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/sync", syncRouter);
