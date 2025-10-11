import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ← GitHub Pages向けに静的出力
  images: {
    unoptimized: true, // ← 画像最適化を無効化（next export対応）
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  basePath: process.env.BASE_PATH, // ← GitHub Pages用のベースパス（自動注入される）
  assetPrefix: process.env.BASE_PATH, // ← 画像やCSSのパスも自動調整
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH, // ← クライアント側にも注入
  },
};

export default nextConfig;
