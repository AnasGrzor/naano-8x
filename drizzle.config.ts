import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

// drizzle-kit runs outside Next.js, so .env is loaded explicitly here.
config({ path: ".env" })

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
})
