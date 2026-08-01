import "server-only";

export async function sendVkMessage(text: string) {
  const params = new URLSearchParams({
    access_token: process.env.VK_BOT_TOKEN!,
    peer_id: process.env.VK_BOT_PEER_ID!,
    message: text,
    random_id: String(Math.floor(Math.random() * 1e9)),
    v: "5.131",
  });

  const res = await fetch(`https://api.vk.ru/method/messages.send?${params}`);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.error_msg ?? "VK API error");
  }

  return data;
}
