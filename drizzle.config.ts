import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.DATABASE_URL?.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined as any,
  },
  verbose: true,
  strict: true,
});
