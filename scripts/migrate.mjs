// Applies db/migrations/*.sql in order, once each. Runs before `next build`.
// Skips quietly when DATABASE_URL is not set (static content mode).
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

// Neon on Vercel also provides a direct (unpooled) URL, preferred for schema changes.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set — skipping (site uses static content).");
  process.exit(0);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });
const dir = path.join(process.cwd(), "db", "migrations");

try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name));
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (applied.has(file)) continue;
    await sql.begin(async (tx) => {
      await tx.unsafe(fs.readFileSync(path.join(dir, file), "utf8"));
      await tx`INSERT INTO schema_migrations (name) VALUES (${file})`;
    });
    console.log(`[migrate] applied ${file}`);
  }
  console.log("[migrate] up to date");
} finally {
  await sql.end();
}
