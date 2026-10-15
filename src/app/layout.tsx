import "./globals.css";
import { Russo_One } from "next/font/google";
import Providers from "@/app/providers";

const displayFont = Russo_One({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-russo",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://nofearhub.com"),
  title: "No Fear",
  description: "No Fear",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "No Fear",
    description: "No Fear",
    url: "https://nofearhub.com",
    siteName: "No Fear",
    images: [
      {
        url: "/images/logo.png",
        width: 2000,
        height: 2000,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "No Fear",
    description: "No Fear",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={displayFont.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
