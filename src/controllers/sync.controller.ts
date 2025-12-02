import { Request, Response } from "express";
import { syncService } from "../services/sync.service";

export const syncController = {
  /**
   * Preview which users would be removed without actually deleting them
   */
  previewSync: async (req: Request, res: Response) => {
    try {
      const result = await syncService.previewOrphanedUsers();

      return res.status(200).json({
        success: true,
        message: "Preview completed successfully",
        ...result,
      });
    } catch (error: any) {
      console.error("Preview sync error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to preview sync",
        details: error.message,
      });
    }
  },

  /**
   * Remove users from auth service that don't exist in API service
   */
  syncUsers: async (req: Request, res: Response) => {
    try {
      const result = await syncService.removeOrphanedUsers();

      const removedCount = result.stats.orphanedUsersRemoved;

      return res.status(200).json({
        success: true,
        message:
          removedCount > 0
            ? "Sync completed successfully"
            : "No orphaned users found - databases are in sync",
        ...result,
      });
    } catch (error: any) {
      console.error("Sync users error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to sync users",
        details: error.message,
      });
    }
  },
};
