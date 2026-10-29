import type { MetadataRoute } from "next";

/**
 * Web app manifest: the name, colours and icons Android and desktop browsers
 * use when the site is installed or pinned. The icons are built by
 * `bun run favicon:prepare`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "push2solutions",
    short_name: "p2s",
    description:
      "p2s designs, builds and operates custom software, mobile apps, automations, AI integrations and cloud infrastructure.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0f12",
    theme_color: "#0e0f12",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
