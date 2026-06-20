import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const databaseUrlEnv = process.env.DATABASE_URL;
const jwtSecretEnv = process.env.JWT_SECRET;
const adminJwtSecretEnv = process.env.ADMIN_JWT_SECRET;
const adminEmailEnv = process.env.ADMIN_EMAIL;
const adminPasswordEnv = process.env.ADMIN_PASSWORD;
const portEnv = process.env.PORT;

const requiredEnv = [
  ["DATABASE_URL", databaseUrlEnv],
  ["JWT_SECRET", jwtSecretEnv],
  ["ADMIN_JWT_SECRET", adminJwtSecretEnv],
  ["ADMIN_EMAIL", adminEmailEnv],
  ["ADMIN_PASSWORD", adminPasswordEnv],
] as const;

for (const [name, value] of requiredEnv) {
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
}

export const env = {
  DATABASE_URL: databaseUrlEnv as string,
  JWT_SECRET: jwtSecretEnv as string,
  ADMIN_JWT_SECRET: adminJwtSecretEnv as string,
  ADMIN_EMAIL: adminEmailEnv as string,
  ADMIN_PASSWORD: adminPasswordEnv as string,
  PORT: portEnv ? Number(portEnv) : 3000,
};

export const {
  DATABASE_URL: databaseUrl,
  JWT_SECRET,
  ADMIN_JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PORT: port,
} = env;
