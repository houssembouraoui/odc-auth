import { Request, Response } from "express";

export const healthController = {
  getHealth: (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "odc-auth",
    });
  },
};

