ALTER TABLE public.raid_attendance
  ADD COLUMN IF NOT EXISTS is_late boolean NOT NULL DEFAULT false;
