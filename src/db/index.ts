import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../env.js";
import * as schema from "./schema.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error", err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
