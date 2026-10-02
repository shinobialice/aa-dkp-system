import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "./googlebutton";
import VkLoginButton from "./vkbutton";
import MailLoginButton from "./mailbutton";

// Общий каркас страниц входа и привязки: слева герб гильдии на тёмном фоне,
// справа карточка с кнопками провайдеров. На мобильных герб уезжает наверх.
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-svh overflow-hidden bg-background lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden items-center justify-center overflow-hidden bg-[#0d0f1a] lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(46,92,170,0.45),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(212,160,60,0.18),transparent_45%)]" />
        <Image
          priority
          src="/images/logo.png"
          alt="No Fear"
          width={640}
          height={640}
          sizes="(min-width: 1024px) 45vw, 0px"
          className="relative w-[min(80%,640px)] h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />
        <p className="absolute bottom-8 left-0 right-0 text-center text-xs font-semibold tracking-[0.35em] text-white/40 uppercase">
          Гильдия No Fear
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_55%)]" />

        <Link href="/" className="relative mb-8 lg:hidden">
          <Image
            priority
            src="/images/logo.png"
            alt="No Fear"
            width={160}
            height={160}
            className="h-32 w-32 drop-shadow-lg"
          />
        </Link>

        <div className="relative w-full max-w-sm rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur sm:p-8">
          <div className="mb-6 space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}

          <div className="space-y-3">
            <GoogleLoginButton />
            <VkLoginButton />
            <MailLoginButton />
          </div>

          {footer && (
            <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
