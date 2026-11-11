-- Backoffice schema. Applied automatically on deploy (scripts/migrate.mjs).

CREATE TABLE IF NOT EXISTS admin_users (
  id              serial PRIMARY KEY,
  email           text NOT NULL UNIQUE,
  name            text NOT NULL,
  password_hash   text NOT NULL,
  session_version integer NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_login_at   timestamptz
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id           serial PRIMARY KEY,
  email        text NOT NULL,
  succeeded    boolean NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_attempts_email_time ON login_attempts (email, attempted_at);

CREATE TABLE IF NOT EXISTS travels (
  id           text PRIMARY KEY,
  city         text NOT NULL,
  country      text NOT NULL,
  country_code char(2) NOT NULL,
  start_date   date NOT NULL,
  end_date     date NOT NULL,
  published    boolean NOT NULL DEFAULT true,
  image_url    text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

-- Official photo/video for a named slot (e.g. "gabrielle-about-hero").
-- Slots without a row fall back to the files in /public.
CREATE TABLE IF NOT EXISTS media_slots (
  slot             text PRIMARY KEY,
  image_url        text,
  alt              text,
  video_url        text,
  video_mobile_url text,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id         serial PRIMARY KEY,
  collection text NOT NULL,
  url        text NOT NULL,
  alt        text NOT NULL,
  position   integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lifestyle_items (
  id         serial PRIMARY KEY,
  section    text NOT NULL CHECK (section IN ('fragrance', 'place', 'wishlist')),
  title      text NOT NULL,
  subtitle   text NOT NULL,
  note       text,
  image_url  text,
  position   integer NOT NULL DEFAULT 0,
  published  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Starting content (examples from the copy deck, to be replaced in the backoffice).
INSERT INTO travels (id, city, country, country_code, start_date, end_date) VALUES
  ('munich-2026-11', 'Munich', 'Germany', 'DE', '2026-11-05', '2026-11-12'),
  ('vienna-2026-11', 'Vienna', 'Austria', 'AT', '2026-11-18', '2026-11-24'),
  ('frankfurt-2026-12', 'Frankfurt', 'Germany', 'DE', '2026-12-02', '2026-12-08')
ON CONFLICT DO NOTHING;

INSERT INTO lifestyle_items (section, title, subtitle, note, position) VALUES
  ('fragrance', 'Baccarat Rouge 540', 'Maison Francis Kurkdjian', 'Warm, luminous and unforgettable.', 1),
  ('fragrance', 'Santal 33', 'Le Labo', 'Woody, soft and quietly confident.', 2),
  ('fragrance', 'Soleil Blanc', 'Tom Ford', 'Summer evenings in a bottle.', 3),
  ('place', 'Hotel Sacher', 'Vienna, Austria', 'Old-world elegance and the perfect slice of cake.', 1),
  ('place', 'Lake Como', 'Lombardy, Italy', 'Slow mornings and views that stay with you.', 2),
  ('place', 'A night at the opera', 'Munich, Germany', 'Music, velvet and a little drama.', 3),
  ('wishlist', 'Silk scarf', 'Hermès', NULL, 1),
  ('wishlist', 'A beautiful first edition', 'A classic novel, beautifully bound', NULL, 2),
  ('wishlist', 'A tasting menu', 'An evening at a chef’s table', NULL, 3);

INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '000000000'),
  ('email', 'hello@example.com'),
  ('instagram_url', 'https://instagram.com/username'),
  ('onlyfans_url', 'https://onlyfans.com/username'),
  ('x_url', 'https://x.com/username'),
  ('telegram_channel_url', 'https://t.me/channelname')
ON CONFLICT DO NOTHING;
