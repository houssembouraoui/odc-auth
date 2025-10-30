import { Application } from "express";
import { authRouter } from "../routes/auth.routes";

export function registerRoutes(app: Application) {
  app.use("/api/auth", authRouter);
}
