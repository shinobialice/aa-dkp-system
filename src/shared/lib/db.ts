import "server-only";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

// Прямое подключение к self-hosted Postgres (замена supabase-js/PostgREST).
// Тегированные шаблоны параметризуются автоматически — безопасно от SQL-инъекций.
// Без camelCase-трансформации: имена колонок остаются как в базе (как раньше
// возвращал supabase-js), чтобы не переписывать заодно весь UI-слой.
//
// В dev-режиме Next.js пересобирает модуль при каждом hot-reload — без этого
// каждая пересборка открывала бы новый пул подключений к Postgres, и они
// быстро исчерпывали лимит соединений базы ("too many clients already").
// Кладём клиент в globalThis, чтобы переиспользовать один и тот же пул между
// пересборками, как принято делать с Prisma/pg в Next.js.
// supabase-js/PostgREST всегда отдавал даты как ISO 8601-строки с "T"
// (это JSON), а postgres.js по умолчанию парсит timestamp/date-колонки либо
// в объекты Date, либо (при отключении парсинга) отдаёт "сырой" текстовый
// формат Postgres ("2026-08-03 09:47:24.92+00" — пробел вместо T, смещение
// без двоеточия). Весь существующий код (склейки, .split("T") и т.п.)
// ожидает именно ISO-формат — нормализуем текст под него, оставляя строкой.
function toIsoLike(x: string): string {
  const m = x.match(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)([+-]\d{2}(?::?\d{2})?)?$/,
  );
  if (!m) return x; // не похоже на timestamp с пробелом (например, чистая date) — не трогаем
  const [, datePart, timePart, tz] = m;
  const offset = tz && /^[+-]\d{2}$/.test(tz) ? `${tz}:00` : tz;
  return `${datePart}T${timePart}${offset ?? ""}`;
}

const KEEP_AS_STRING = {
  to: 1114,
  from: [1082, 1114, 1184], // date, timestamp, timestamptz
  serialize: (x: unknown) => x,
  parse: (x: string) => toIsoLike(x),
};

// postgres.js по умолчанию парсит числами только int2/int4/oid/float4/float8 —
// NUMERIC/DECIMAL (oid 1700, напр. проценты в Salary: aglPercent, weightPercent
// и т.п.) остаётся "сырой" строкой, чтобы не терять точность у произвольно
// больших чисел. supabase-js/PostgREST раньше отдавал их как JSON-числа, и весь
// UI (.toFixed() и арифметика) ожидает именно number — приводим numeric к
// JS number, как было раньше.
const NUMERIC_AS_NUMBER = {
  to: 1700,
  from: [1700],
  serialize: (x: unknown) => String(x),
  parse: (x: string) => Number(x),
};

const sql =
  global.__sql ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    types: {
      date: KEEP_AS_STRING,
      numeric: NUMERIC_AS_NUMBER,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.__sql = sql;
}

export default sql;
