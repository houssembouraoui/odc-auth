"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.deleteUsersByIds = exports.getAllUsers = exports.updateUser = exports.createUser = exports.getUserById = exports.getUserByEmail = void 0;
const database_1 = require("../config/database");
const getUserByEmail = async (email) => {
    return database_1.prisma.user.findUnique({ where: { email } });
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    return database_1.prisma.user.findUnique({ where: { id } });
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    return database_1.prisma.user.create({ data });
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    return database_1.prisma.user.update({ where: { id }, data });
};
exports.updateUser = updateUser;
const getAllUsers = async () => {
    return database_1.prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
};
exports.getAllUsers = getAllUsers;
const deleteUsersByIds = async (userIds) => {
    return database_1.prisma.user.deleteMany({
        where: {
            id: {
                in: userIds,
            },
        },
    });
};
exports.deleteUsersByIds = deleteUsersByIds;
const deleteUserById = async (id) => {
    return database_1.prisma.user.delete({ where: { id } });
};
exports.deleteUserById = deleteUserById;
