/**
 * NEXT_PUBLIC_BASE_URL иногда задаётся со слэшем на конце (в Vercel),
 * из-за чего склейка `${baseUrl}/api/...` даёт двойной слэш и ломает
 * сверку redirect_uri у OAuth-провайдеров (Google/VK/Mail.ru).
 * Всегда используйте этот хелпер вместо process.env.NEXT_PUBLIC_BASE_URL
 * напрямую при склейке путей.
 */
export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/+$/, "");
}
