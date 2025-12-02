import { Application } from "express";
import { authRouter } from "../routes/auth.routes";
import { syncRouter } from "../routes/sync.routes";

export function registerRoutes(app: Application) {
  app.use("/api/auth", authRouter);
  app.use("/api/sync", syncRouter);
}
