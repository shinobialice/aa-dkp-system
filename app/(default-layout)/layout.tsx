import { Toaster } from "@/components/sonner";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { hasTag } from "@/src/actions/hasTag";
import AppSidebar from "@/src/components/sidebar";
import ThemeProvider from "@/src/components/theme-provider";
import { cookies } from "next/headers";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionToken = (await cookies()).get("session_token").value;
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen>
        <div className="flex bg-background text-foreground w-full">
          <AppSidebar isAdmin={isAdmin} />
          <div className="flex flex-col flex-1">
            <header className="lg:hidden flex h-12 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 h-4" />
              <h1 className="text-base font-medium">No Fear</h1>
            </header>
            <main className="flex-1 p-8">
              {children}
              <Toaster richColors />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
