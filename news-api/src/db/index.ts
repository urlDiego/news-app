import 'dotenv/config'
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production" || connectionString?.includes("railway");

export const pool = new Pool({
  connectionString,
  ...(isProduction && !connectionString?.includes("localhost")
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

export const db = drizzle({ client: pool });
