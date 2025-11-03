"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.ENV.EMAIL_HOST,
    auth: {
        user: env_1.ENV.EMAIL_USER,
        pass: env_1.ENV.EMAIL_PASS,
    },
});
async function sendMail(to, subject, text) {
    return transporter.sendMail({ from: env_1.ENV.EMAIL_USER, to, subject, text });
}
