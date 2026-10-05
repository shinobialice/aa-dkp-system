import "server-only";

type CachedName = { fullName: string | null; expiresAt: number };

const VK_API_VERSION = "5.131";
const CACHE_TTL_MS = 60 * 60 * 1000;

const cachedNames = new Map<string, CachedName>();

// users.get принимает числовой ID или screen_name, а не "id<число>" из ссылки.
function toVkApiId(vkUsername: string): string {
  const match = vkUsername.match(/^id(\d+)$/i);
  return match ? match[1] : vkUsername;
}

export async function getVkRealNames(
  vkUsernames: string[],
): Promise<Record<string, string>> {
  const keys = [
    ...new Set(
      vkUsernames.filter(Boolean).map((username) => username.toLowerCase()),
    ),
  ];
  const now = Date.now();
  const staleKeys = keys.filter(
    (key) => (cachedNames.get(key)?.expiresAt ?? 0) <= now,
  );

  if (staleKeys.length > 0) {
    const fetched = await fetchVkNames(staleKeys);
    if (fetched) {
      for (const key of staleKeys) {
        cachedNames.set(key, {
          fullName: fetched[key] ?? null,
          expiresAt: now + CACHE_TTL_MS,
        });
      }
    }
  }

  const namesByKey: Record<string, string> = {};
  for (const key of keys) {
    const fullName = cachedNames.get(key)?.fullName;
    if (fullName) namesByKey[key] = fullName;
  }
  return namesByKey;
}

async function fetchVkNames(
  keys: string[],
): Promise<Record<string, string> | null> {
  const params = new URLSearchParams({
    user_ids: keys.map(toVkApiId).join(","),
    fields: "screen_name",
    access_token: process.env.VK_ACCESS_TOKEN ?? "",
    v: VK_API_VERSION,
  });

  try {
    const res = await fetch(`https://api.vk.ru/method/users.get?${params}`);
    const data = await res.json();
    if (!Array.isArray(data.response)) {
      console.error("VK API вернул ошибку при загрузке имён:", data.error);
      return null;
    }

    const namesByKey: Record<string, string> = {};
    for (const vkUser of data.response) {
      const fullName = `${vkUser.first_name} ${vkUser.last_name}`;
      if (vkUser.screen_name) {
        namesByKey[String(vkUser.screen_name).toLowerCase()] = fullName;
      }
      namesByKey[String(vkUser.id).toLowerCase()] = fullName;
      namesByKey[`id${vkUser.id}`] = fullName;
    }
    return namesByKey;
  } catch (error) {
    console.error("Error loading VK names:", error);
    return null;
  }
}
