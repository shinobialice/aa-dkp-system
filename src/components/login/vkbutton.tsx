"use client";

export default function VkLoginButton() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_VK_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_VK_REDIRECT_URI!,
      response_type: "code",
      scope: "email",
      v: "5.131",
    });

    window.location.href = `https://oauth.vk.com/authorize?${params.toString()}`;
  };

  return <button onClick={handleLogin}>Войти через VK</button>;
}
