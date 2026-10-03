export function requireEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Не задана переменная окружения ${name}`);
  return value;
}
