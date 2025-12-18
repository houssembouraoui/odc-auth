import { PrismaClient } from "@prisma/client";
import { getAllUsers, deleteUsersByIds } from "../repositories/user.repository";

// Separate Prisma client pointing at the API service database
const apiPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.API_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

type SyncOptions = {
  /**
   * Emails that should NEVER be considered orphaned, even if they don't
   * exist in the API service database (e.g. admin accounts).
   */
  protectedEmails?: string[];
};

function buildProtectedEmailSet(options?: SyncOptions): Set<string> {
  const emails = options?.protectedEmails || [];
  return new Set(
    emails
      .map((e) => e?.trim())
      .filter((e): e is string => Boolean(e))
      .map((e) => e.toLowerCase())
  );
}

export const syncService = {
  async getApiServiceEmails(): Promise<Set<string>> {
    try {
      // Use raw SQL since the API service has a different schema (Profile vs User)
      const apiProfiles = await apiPrisma.$queryRaw<Array<{ email: string }>>`
        SELECT email FROM "Profile"
      `;

      return new Set(apiProfiles.map((p) => p.email.toLowerCase()));
    } catch (error) {
      console.error("Error fetching API service emails:", error);
      throw new Error("Failed to connect to API service database");
    }
  },

  /**
   * Preview orphaned users without deleting.
   * Admin / special accounts can be protected via `protectedEmails`.
   */
  async previewOrphanedUsers(options?: SyncOptions) {
    const apiEmails = await this.getApiServiceEmails();
    const authUsers = await getAllUsers();
    const protectedSet = buildProtectedEmailSet(options);

    const orphanedUsers = authUsers.filter((user) => {
      const email = user.email.toLowerCase();
      return apiEmails.has(email) === false && protectedSet.has(email) === false;
    });

    return {
      stats: {
        apiServiceUsers: apiEmails.size,
        authServiceUsers: authUsers.length,
        orphanedUsersToRemove: orphanedUsers.length,
      },
      orphanedUsers: orphanedUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
      })),
    };
  },

  /**
   * Remove orphaned users from auth service.
   * Admin / special accounts can be protected via `protectedEmails`.
   */
  async removeOrphanedUsers(options?: SyncOptions) {
    const apiEmails = await this.getApiServiceEmails();
    const authUsers = await getAllUsers();
    const protectedSet = buildProtectedEmailSet(options);

    const orphanedUsers = authUsers.filter((user) => {
      const email = user.email.toLowerCase();
      return apiEmails.has(email) === false && protectedSet.has(email) === false;
    });

    const authServiceUsersBefore = authUsers.length;

    if (orphanedUsers.length > 0) {
      const orphanedIds = orphanedUsers.map((u) => u.id);
      await deleteUsersByIds(orphanedIds);
    }

    return {
      stats: {
        apiServiceUsers: apiEmails.size,
        authServiceUsersBefore,
        orphanedUsersRemoved: orphanedUsers.length,
        authServiceUsersAfter: authServiceUsersBefore - orphanedUsers.length,
      },
      removedUsers: orphanedUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
      })),
    };
  },
};
