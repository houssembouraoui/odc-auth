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
   * Preview orphaned users without deleting
   */
  async previewOrphanedUsers() {
    const apiEmails = await this.getApiServiceEmails();
    const authUsers = await getAllUsers();

    const orphanedUsers = authUsers.filter(
      (user) => apiEmails.has(user.email.toLowerCase()) === false
    );

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
   * Remove orphaned users from auth service
   */
  async removeOrphanedUsers() {
    const apiEmails = await this.getApiServiceEmails();
    const authUsers = await getAllUsers();

    const orphanedUsers = authUsers.filter(
      (user) => apiEmails.has(user.email.toLowerCase()) === false
    );

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
