import nodemailer from "nodemailer";
import { ENV } from "../config/env";

const transporter = nodemailer.createTransport({
  host: ENV.EMAIL_HOST,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export async function sendMail(to: string, subject: string, text: string) {
  return transporter.sendMail({ from: ENV.EMAIL_USER, to, subject, text });
}
