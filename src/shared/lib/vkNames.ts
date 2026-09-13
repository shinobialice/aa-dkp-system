import "server-only";

const VK_API_VERSION = "5.131";

export async function getVkRealNames(
  vkUsernames: string[],
): Promise<Record<string, string>> {
  const uniqueUsernames = [...new Set(vkUsernames.filter(Boolean))];
  if (uniqueUsernames.length === 0) {
    return {};
  }

  const accessToken = process.env.VK_ACCESS_TOKEN;
  const url = `https://api.vk.ru/method/users.get?user_ids=${uniqueUsernames.join(",")}&fields=screen_name&access_token=${accessToken}&v=${VK_API_VERSION}`;

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
    }
  } catch (error) {
    console.error("Error loading VK names:", error);
  }

  return namesByKey;
}
