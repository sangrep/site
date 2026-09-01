import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the landing has no server routes, so it ships as plain
  // files (out/) that any static host can serve, e.g. Cloudflare.
  output: "export",
  turbopack: {
    root: siteRoot,
  },
};

export default nextConfig;
