"use client";

import ThemeProvider from "@/widgets/theme-provider";
import { StaleChunkReload } from "@/shared/lib/StaleChunkReload";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <StaleChunkReload />
      {children}
    </ThemeProvider>
  );
}
