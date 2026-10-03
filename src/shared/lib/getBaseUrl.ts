import { requireEnv } from "./env";

// NEXT_PUBLIC_BASE_URL бывает со слэшем на конце, а двойной слэш ломает
// сверку redirect_uri у OAuth-провайдеров.
export function getBaseUrl() {
  return requireEnv(
    process.env.NEXT_PUBLIC_BASE_URL,
    "NEXT_PUBLIC_BASE_URL",
  ).replace(/\/+$/, "");
}
