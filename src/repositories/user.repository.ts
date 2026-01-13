import { prisma } from "../config/database";
import { Prisma } from "@prisma/client";
import { User } from "../models/user.model";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  return prisma.user.create({ data });
};

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return prisma.user.update({ where: { id }, data });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
};

export const deleteUsersByIds = async (userIds: string[]) => {
  return prisma.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
};

export const deleteUserById = async (id: string): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

