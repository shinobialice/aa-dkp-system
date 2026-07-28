-- Анталлон: в базе было 5, по актуальной таблице очков должно быть 10
UPDATE public.boss SET dkp_points = 10 WHERE id = 7 AND boss_name = 'Анталлон';

-- Флаги прока для АГЛ-рейдов (аналогично is_pvp/is_pvp_long)
ALTER TABLE public.raid
  ADD COLUMN IF NOT EXISTS is_proc boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_double_proc boolean NOT NULL DEFAULT false;
