import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      The hero scene is a stack of large transparent PNGs. AVIF keeps the alpha
      at a fraction of the weight, with WebP for browsers without it.
    */
    formats: ["image/avif", "image/webp"],
    /*
      Placeholder founder portraits, served by a public avatar service until the
      real photos are added under `public/team/`. Remove this pattern then.
    */
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc", pathname: "/600" }],
  },
};

export default nextConfig;
