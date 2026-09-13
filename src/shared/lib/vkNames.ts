import "server-only";

const VK_API_VERSION = "5.131";

// Профиль без кастомного screen_name отдаёт себя в URL как "vk.com/id<число>" —
// именно так это и попадает в vk_name при вводе ссылки. Но users.get принимает
// в user_ids либо чистый числовой ID, либо screen_name, а не "id<число>" —
// поэтому перед запросом снимаем этот префикс.
function toVkApiId(vkUsername: string): string {
  const match = vkUsername.match(/^id(\d+)$/i);
  return match ? match[1] : vkUsername;
}

export async function getVkRealNames(
  vkUsernames: string[],
): Promise<Record<string, string>> {
  const uniqueUsernames = [...new Set(vkUsernames.filter(Boolean))];
  if (uniqueUsernames.length === 0) {
    return {};
  }

  const accessToken = process.env.VK_ACCESS_TOKEN;
  const apiIds = uniqueUsernames.map(toVkApiId);
  const url = `https://api.vk.ru/method/users.get?user_ids=${apiIds.join(",")}&fields=screen_name&access_token=${accessToken}&v=${VK_API_VERSION}`;

  const namesByKey: Record<string, string> = {};

  try {
    const res = await fetch(url);
    const data = await res.json();

    for (const vkUser of data.response ?? []) {
      const fullName = `${vkUser.first_name} ${vkUser.last_name}`;
      if (vkUser.screen_name) {
        namesByKey[String(vkUser.screen_name).toLowerCase()] = fullName;
      }
      namesByKey[String(vkUser.id).toLowerCase()] = fullName;
      namesByKey[`id${vkUser.id}`] = fullName;
    }
  } catch (error) {
    console.error("Error loading VK names:", error);
  }

  return namesByKey;
}
