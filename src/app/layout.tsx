import type { Viewport } from "next";
import "./globals.css";
import { rootMetadata } from "@/lib/site-metadata";

export const viewport: Viewport = {
  themeColor: "#F4F1EC",
};

export const metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
