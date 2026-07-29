ALTER TABLE boss_respawn DISABLE ROW LEVEL SECURITY;
ALTER TABLE boss_respawn_history DISABLE ROW LEVEL SECURITY;

GRANT ALL ON boss_respawn TO anon, authenticated;
GRANT ALL ON boss_respawn_history TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE boss_respawn_history_id_seq TO anon, authenticated;
