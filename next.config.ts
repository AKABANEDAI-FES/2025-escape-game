import type { NextConfig } from "next";

const repo = "2025-escape-game";

const nextConfig: NextConfig = {
  output: "export",
  
  images: {
    unoptimized: true,
  },
  
  basePath: `/${repo}`,
  assetPrefix: `/${repo}`,
};

export default nextConfig;