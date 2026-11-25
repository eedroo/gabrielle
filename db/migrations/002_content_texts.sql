-- Text overrides edited in the backoffice (Texts). Key = content path, e.g. "home.hero.title".
-- Texts without a row use the defaults in src/content.
CREATE TABLE IF NOT EXISTS content_texts (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
