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
  EMAIL_HOST: getEnv("EMAIL_HOST"),
  EMAIL_PORT: Number(getEnv("EMAIL_PORT", "587")),
  EMAIL_SECURE: getEnv("EMAIL_SECURE", "false") === "true",
  EMAIL_USER: getEnv("EMAIL_USER"),
  EMAIL_PASS: getEnv("EMAIL_PASS"),
};
