import type { Metadata } from "next";
import { brand } from "./brand";

/** Preview storefront. Supplier photo license is unconfirmed, so the site stays out of indexes. */
export const previewRobots = { index: false, follow: false } as const;

export const rootMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${brand.zh} ${brand.en}`, template: `%s · ${brand.zh}` },
  description: "MORALUNE. Art rugs, textiles, wall hangings, objects, and lamps for quiet rooms. 块毯、织物、墙面、器物与灯。",
  robots: previewRobots,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};
