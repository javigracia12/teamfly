import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Cloudflare Pages (next-on-pages): enable dev bindings from wrangler.toml in local dev
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@cloudflare/next-on-pages/next-dev").setupDevPlatform();
}

export default nextConfig;
