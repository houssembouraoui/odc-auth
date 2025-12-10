import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const val = process.env[key] || fallback;
  if (!val) throw new Error(`Missing env variable: ${key}`);
  return val;
}

export const ENV = {
  PORT: Number(getEnv("PORT", "3000")),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  BREVO_API_KEY: getEnv("BREVO_API_KEY"),
  EMAIL_FROM: getEnv("EMAIL_FROM"),
  EMAIL_FROM_NAME: getEnv("EMAIL_FROM_NAME", "ODC Auth"), // Sender name
};
