"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import VkLoginButton from "@/src/components/login/vkbutton";
import Cookies from "js-cookie";
import MailLoginButton from "@/src/components/login/mailbutton";
import GoogleLoginButton from "@/src/components/login/googlebutton";

export default function LinkAccountPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<{
    username: string;
    expiresAt: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    Cookies.set("link-token", token, {
      expires: 0.1,
      path: "/",
    });

    fetch(`/api/link-token/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Token not valid");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
      })
      .catch(() => {
        setUserInfo(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <p className="p-4 text-center">Загрузка...</p>;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Heart className="size-4" />
            </div>
            No Fear
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-3">
            <h1 className="text-2xl font-bold text-center">
              Привязка аккаунта к <br />
              <span className="text-primary">{userInfo?.username}</span>
            </h1>

            <p className="text-sm text-muted-foreground text-center">
              Ссылка действительна до:{" "}
              <span className="font-medium">
                {new Date(userInfo?.expiresAt || "").toLocaleString("ru-RU")}
              </span>
            </p>

            <GoogleLoginButton />
            <VkLoginButton />
            <MailLoginButton />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/login_banner.png"
          alt="Login Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
