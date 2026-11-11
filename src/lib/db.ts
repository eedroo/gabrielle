import "server-only";
import postgres from "postgres";

/**
 * Postgres (Neon) client. `null` when DATABASE_URL is not set: the public site
 * then runs on the static content in src/content and the backoffice is off.
 */
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // prepare: false keeps it compatible with Neon's pooled (PgBouncer) connection.
  return postgres(url, { max: 5, prepare: false, idle_timeout: 20, onnotice: () => {} });
}

export const sql: postgres.Sql | null = globalForDb.sql ?? createClient();
if (sql && process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const hasDatabase = sql !== null;
