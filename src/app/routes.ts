import { Application, Request, Response } from "express";
import { authRouter } from "../routes/auth.routes";
import { syncRouter } from "../routes/sync.routes";

export function registerRoutes(app: Application) {
  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "odc-auth",
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/sync", syncRouter);
}
