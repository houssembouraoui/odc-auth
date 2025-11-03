"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.getUserById = exports.getUserByEmail = void 0;
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
