import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DEV ONLY: this project lives under iCloud Drive, and Turbopack's dev cache
  // writes hundreds of small, constantly-changing files — iCloud tries to sync
  // every one of them in real time, which repeatedly stalls/crashes the dev
  // server with filesystem read timeouts. Keeping the dev build output on
  // local, non-synced disk avoids that. This MUST NOT apply to production
  // builds (Vercel/host): that absolute path doesn't exist there and would
  // break the build — so it's scoped to `next dev` only.
  ...(process.env.NODE_ENV === "development"
    ? { distDir: "/Users/hafizasadseo/.next-cache/themealprepideas" }
    : {}),
  images: {
    // Serve images directly from their source instead of running them through
    // Next.js's on-demand image optimizer. On this shared Hostinger Node plan
    // the optimizer (generating multiple sizes/formats per image as crawlers
    // hit many recipe pages) spiked CPU/memory and kept taking the server down
    // (nginx 504). Source images are already reasonably sized webp/png, so
    // unoptimized delivery trades a little bandwidth for a stable server.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
