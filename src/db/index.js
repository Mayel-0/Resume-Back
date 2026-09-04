import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import "dotenv/config";
import * as schema from "./schema.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error", err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
