import { Router } from "express";
import { syncController } from "../controllers/sync.controller";

export const syncRouter = Router();

// GET /api/sync/preview
syncRouter.get("/preview", syncController.previewSync);

// POST /api/sync/users
syncRouter.post("/users", syncController.syncUsers);


