"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/src/components/login/authIcons";
import { VKIDWidget } from "@/src/components/login/VKIDWidget";

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

            <VKIDWidget mode="login" />
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
