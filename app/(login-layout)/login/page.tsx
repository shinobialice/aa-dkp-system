"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, MailIcon, VkIcon } from "@/src/components/login/authIcons";

export default function LoginPage() {
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
          <div className="w-full max-w-xs space-y-6">
            <h1 className="text-2xl font-bold text-center pb-3">
              Вход в систему
            </h1>

            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full gap-2 cursor-pointer"
              variant="outline"
            >
              <GoogleIcon />
              Войти через Google
            </Button>

            <div>
              <script src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"></script>
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `
                  if ('VKIDSDK' in window) {
                    console.log("VK loaded")
                    const VKID = window.VKIDSDK;

                    VKID.Config.init({
                      app: 53496711,
                      redirectUrl: 'https://aa-dkp-system.vercel.app/',
                      responseMode: VKID.ConfigResponseMode.Callback,
                      source: VKID.ConfigSource.LOWCODE,
                      scope: '', // Complete the necessary accesses as needed
                    });

                    const oAuth = new VKID.OAuthList();

                    oAuth.render({
                      container: document.currentScript.parentElement,
                      scheme: 'dark',
                      oauthList: [
                        'vkid',
                        'mail_ru'
                      ]
                    })
                    .on(VKID.WidgetEvents.ERROR, vkidOnError)
                    .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, function (payload) {
                      const code = payload.code;
                      const deviceId = payload.device_id;

                      VKID.Auth.exchangeCode(code, deviceId)
                        .then(vkidOnSuccess)
                        .catch(vkidOnError);
                    });
                  
                    function vkidOnSuccess(data) {
                      // Processing result
                    }
                  
                    function vkidOnError(error) {
                      // Processing error
                      console.error('Error:', error);
                    }
                  }
                  `,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          fill
          src="/images/login_banner.jpg"
          alt="Login Image"
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
