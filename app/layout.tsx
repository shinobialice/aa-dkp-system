// app/layout.tsx
import "./globals.css";
import Providers from "@/src/components/providers";

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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
