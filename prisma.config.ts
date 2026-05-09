// Prisma configuration for local development
import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || `file:${dbPath}`,
  },
});