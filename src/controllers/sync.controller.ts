import { Request, Response } from "express";
import { syncService } from "../services/sync.service";

function extractProtectedEmailsFromQuery(req: Request): string[] | undefined {
  const value =
    (req.query.adminEmail as string | string[] | undefined) ??
    (req.query.adminEmails as string | string[] | undefined);

  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value;
  }

  // Support comma-separated single query param: ?adminEmail=a@x.com,b@y.com
  return value.split(",").map((v) => v.trim());
}

function extractProtectedEmailsFromBody(req: Request): string[] | undefined {
  const { adminEmail, adminEmails } = (req.body || {}) as {
    adminEmail?: string;
    adminEmails?: string[] | string;
  };

  if (Array.isArray(adminEmails)) {
    return adminEmails;
  }

  if (typeof adminEmails === "string") {
    return adminEmails.split(",").map((v) => v.trim());
  }

  if (typeof adminEmail === "string") {
    return [adminEmail];
  }

  return undefined;
}

export const syncController = {
  /**
   * Preview which users would be removed without actually deleting them.
   *
   * Optional: pass one or more admin/protected emails so they are never
   * flagged as orphaned:
   *   GET /api/sync/preview?adminEmail=admin@example.com
   *   GET /api/sync/preview?adminEmail=a@x.com&adminEmail=b@y.com
   *   GET /api/sync/preview?adminEmail=a@x.com,b@y.com
   */
  previewSync: async (req: Request, res: Response) => {
    try {
      const protectedEmails = extractProtectedEmailsFromQuery(req);

      const result = await syncService.previewOrphanedUsers({
        protectedEmails,
      });

      return res.status(200).json({
        success: true,
        message: "Preview completed successfully",
        protectedEmails,
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
   * Remove users from auth service that don't exist in API service.
   *
   * Optional: pass one or more admin/protected emails so they are never
   * deleted:
   *   POST /api/sync/users
   *   {
   *     "adminEmail": "admin@example.com"
   *   }
   * or
   *   {
   *     "adminEmails": ["admin@example.com", "support@example.com"]
   *   }
   */
  syncUsers: async (req: Request, res: Response) => {
    try {
      const protectedEmails = extractProtectedEmailsFromBody(req);

      const result = await syncService.removeOrphanedUsers({
        protectedEmails,
      });

      const removedCount = result.stats.orphanedUsersRemoved;

      return res.status(200).json({
        success: true,
        message:
          removedCount > 0
            ? "Sync completed successfully"
            : "No orphaned users found - databases are in sync",
        protectedEmails,
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
