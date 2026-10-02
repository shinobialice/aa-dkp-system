"use client";

import { useEffect, useState } from "react";
import { Clock, Link2, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthShell from "@/widgets/login/AuthShell";

export default function LinkAccountPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<{
    username: string;
    expiresAt: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/link-token/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Token not valid");
        return res.json();
      })
      .then((data) => {
        Cookies.set("link-token", token, {
          expires: 0.1,
          path: "/",
        });
        setUserInfo(data);
      })
      .catch(() => {
        Cookies.remove("link-token", { path: "/" });
        router.replace("/");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  if (loading || !userInfo) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthShell
      title="Привязка аккаунта"
      subtitle="Выберите, через что будете входить на сайт"
      footer="Ссылка одноразовая — не пересылайте её другим."
    >
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Link2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Профиль</p>
            <p className="truncate text-lg font-semibold">
              {userInfo.username}
            </p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          Действует до{" "}
          <span className="font-medium text-foreground">
            {new Date(userInfo.expiresAt).toLocaleString("ru-RU")}
          </span>
        </p>
      </div>
    </AuthShell>
  );
}
