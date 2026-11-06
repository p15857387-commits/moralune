import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";

export const viewport: Viewport = {
  themeColor: "#F4F1EC",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${brand.zh} ${brand.en}`, template: `%s · ${brand.zh}` },
  description: "MORALUNE — objects for everyday living. Rugs, textiles, wall, objects, and light. 为日常，选一点刚刚好的美。",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
