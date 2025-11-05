"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
exports.generateTempPassword = generateTempPassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
async function hashPassword(plain) {
    return bcrypt_1.default.hash(plain, SALT_ROUNDS);
}
async function comparePasswords(plain, hash) {
    return bcrypt_1.default.compare(plain, hash);
}
function generateTempPassword(length = 12) {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confusable
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const symbols = "!@#$%^&*";
    const all = upper + lower + digits + symbols;
    let pwd = "";
    // ensure complexity
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += digits[Math.floor(Math.random() * digits.length)];
    pwd += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = pwd.length; i < length; i++) {
        pwd += all[Math.floor(Math.random() * all.length)];
    }
    return pwd
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}
