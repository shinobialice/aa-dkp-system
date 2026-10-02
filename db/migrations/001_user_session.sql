-- Несколько сессий на игрока: раньше токен жил в "user".session_token,
-- и каждый вход перезаписывал его, выкидывая с остальных устройств.
-- В базе храним только sha256 от токена — утёкший дамп не даёт войти.
--
-- Запускать ДО деплоя кода, который читает user_session.

CREATE TABLE IF NOT EXISTS user_session (
  token_hash text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_agent text
);

CREATE INDEX IF NOT EXISTS user_session_user_id_idx ON user_session (user_id);

-- Переносим текущие сессии, чтобы после деплоя никого не разлогинило.
INSERT INTO user_session (token_hash, user_id, expires_at)
SELECT encode(sha256(session_token::bytea), 'hex'), id, now() + interval '7 days'
FROM "user"
WHERE session_token IS NOT NULL
ON CONFLICT DO NOTHING;

-- Колонку "user".session_token код больше не использует. Удалить её
-- можно отдельно, когда новая схема проработает какое-то время:
--   ALTER TABLE "user" DROP COLUMN session_token;
