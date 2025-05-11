"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Props = {
  mode: "login" | "link";
};

export function VKIDWidget({ mode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    if (document.getElementById("vkid-sdk-script")) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@vkid/sdk@2/dist-sdk/umd/index.js";
    script.id = "vkid-sdk-script";
    script.async = true;

    script.onload = () => {
      const VKID = (window as any).VKIDSDK;
      if (!VKID || !containerRef.current) return;

      VKID.Config.init({
        app: 53496711,
        redirectUrl: "https://aa-dkp-system.vercel.app/",
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: "",
      });

      const oAuth = new VKID.OAuthList();

      oAuth
        .render({
          container: containerRef.current,
          scheme: "dark",
          oauthList: ["vkid", "mail_ru"],
        })
        .on(VKID.WidgetEvents.ERROR, () => {
          router.push("/auth/error");
        })
        .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, (payload: any) => {
          VKID.Auth.exchangeCode(payload.code, payload.device_id)
            .then(async (data: any) => {
              try {
                const decoded: any = jwtDecode(data.id_token);
                const vk_id = String(decoded.sub);
                const token = Cookies.get("link-token");

                const res = await fetch("/api/auth/vkid-login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    vk_id,
                    linkToken: mode === "link" ? token : null,
                  }),
                });

                const result = await res.json();
                setDebug(result);
                alert(JSON.stringify(result, undefined, 2));

                if (!result.success) {
                  throw new Error();
                }

                if (mode === "link") {
                  router.push("/link-account/complete");
                } else {
                  window.location.href = "/?vk_success=1";
                }
              } catch {
                router.push("/auth/error");
              }
            })
            .catch(() => {
              router.push("/auth/error");
            });
        });
    };

    document.body.appendChild(script);
  }, [mode, router]);

  return (
    <>
      <div ref={containerRef} />
      {debug && (
        <pre className="mt-4 p-2 bg-muted text-xs whitespace-pre-wrap">
          {JSON.stringify(debug, null, 2)}
        </pre>
      )}
    </>
  );
}
