ALTER TABLE public."user"
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
