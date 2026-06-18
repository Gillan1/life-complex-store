import type { NextConfig } from "next";

const repo = "life-complex-store";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // ✅ تم إصلاح: إزالة ignoreBuildErrors لكشف الأخطاء الحقيقية مبكراً
  reactStrictMode: true,
  // GitHub Pages serves at https://<user>.github.io/<repo>/
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  trailingSlash: true,
};

export default nextConfig;
