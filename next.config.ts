import type { NextConfig } from "next";

const repo = "2025-escape-game";
const assetPrefix = process.env.NODE_ENV === "production" ? `/${repo}` : "";
const basePath = process.env.NODE_ENV === "production" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
};

export default nextConfig;