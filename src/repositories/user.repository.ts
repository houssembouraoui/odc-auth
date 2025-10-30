import { prisma } from "../config/database";
import { User } from "../models/user.model";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  return prisma.user.create({ data });
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  return prisma.user.update({ where: { id }, data });
};
