import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MORALUNE",
    short_name: "MORALUNE",
    description: "MORALUNE — objects for everyday living.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F1EC",
    theme_color: "#F4F1EC",
    icons: [
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
