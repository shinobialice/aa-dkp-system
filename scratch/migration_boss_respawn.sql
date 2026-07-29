CREATE TABLE IF NOT EXISTS boss_respawn (
  boss_name text PRIMARY KEY,
  last_kill timestamptz,
  packs_needed integer,
  updated_by integer,
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS boss_respawn_history (
  id bigserial PRIMARY KEY,
  boss_name text NOT NULL,
  action text NOT NULL,
  kill_time timestamptz NOT NULL,
  prev_kill_time timestamptz,
  next_respawn timestamptz,
  user_id integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE boss_respawn ADD COLUMN IF NOT EXISTS packs_needed integer;
