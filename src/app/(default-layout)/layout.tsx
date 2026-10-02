import "@/shared/lib/valibot";
import Image from "next/image";
import Link from "next/link";
import { SidebarProvider, Toaster } from "@/shared/ui";
import { hasTag } from "@/actions/hasTag";
import AppSidebar from "@/widgets/sidebar";
import MobileNav from "@/widgets/sidebar/MobileNav";
import { HeartbeatTracker } from "@/widgets/sidebar/HeartbeatTracker";
import { SessionGuard } from "@/widgets/sidebar/SessionGuard";
import { GuildLocationBadge } from "@/widgets/sidebar/GuildLocationBadge";
import { EventNotifications } from "@/widgets/EventNotifications/EventNotifications";
import { AnniversaryBalloons } from "@/widgets/AnniversaryBalloons/AnniversaryBalloons";
import { cookies } from "next/headers";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore?.get("session_token")?.value ?? "";
  const sidebarOpen = cookieStore?.get("sidebar_state")?.value !== "false";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const isRealAdmin = await hasTag(sessionToken, ["Администратор"], {
    ignorePreview: true,
  });
  const viewingAsRegular = isRealAdmin && !isAdmin;
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <HeartbeatTracker />
      <SessionGuard />
      <EventNotifications />
      <AnniversaryBalloons />
      <div className="flex bg-background text-foreground w-full">
        <AppSidebar
          isAdmin={isAdmin}
          isRealAdmin={isRealAdmin}
          viewingAsRegular={viewingAsRegular}
          locationBadge={<GuildLocationBadge />}
          locationIcon={<GuildLocationBadge variant="icon" />}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-2.5 border-b px-4 md:hidden">
            <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 object-contain"
              />
              <span className="truncate text-lg font-bold text-primary">No Fear</span>
            </Link>
            <GuildLocationBadge variant="compact" />
          </header>
          <main className="flex-1 px-4 pt-6 pb-28 sm:px-8 md:p-8">
            {children}
            <Toaster
              richColors
              mobileOffset={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
            />
          </main>
        </div>
      </div>
      <MobileNav
        isAdmin={isAdmin}
        isRealAdmin={isRealAdmin}
        viewingAsRegular={viewingAsRegular}
      />
    </SidebarProvider>
  );
}
