import express from "express";
import { authRouter } from "../routes/auth.routes";
import { loggerMiddleware } from "../middleware/logger.middleware";

export const app = express();
app.use(express.json());
app.use(loggerMiddleware);
app.use("/api/auth", authRouter);
