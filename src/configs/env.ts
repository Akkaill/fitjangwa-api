import dotenv from "dotenv";
import { z } from "zod";

const check = process.env.NODE_ENV || "development";
const envfile = check === "development" ? ".env.local" : ".env";

dotenv.config({ path: envfile });

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.string().default("development"),
  JWT_SECRET: z.string(),
  RT_SECRET: z.string(),
  HASH_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
