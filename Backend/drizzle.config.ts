import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/config";


export default defineConfig({
    schema:'./src/db/scheme.ts',
    dialect:'postgresql',
    dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})