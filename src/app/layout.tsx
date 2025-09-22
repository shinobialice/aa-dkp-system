import "./globals.css";
import Providers from "@/widgets/providers";

export const metadata = {
  title: "No Fear",
  description: "No Fear - No Pain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
