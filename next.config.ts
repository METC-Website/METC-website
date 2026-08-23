import type { NextConfig } from "next";

const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") || "";

const nextConfig: NextConfig = {
  // Vercel is the only deployment target; it serves the static export.
  output: "export",

  // 允许本地开发来源
  allowedDevOrigins: ["127.0.0.1"],

  // Turbopack 配置
  turbopack: {
    root: process.cwd(),
  },

  // Static export does not provide the Next Image optimization server.
  // Public display images are optimized before upload and served from R2.
  images: {
    unoptimized: true,
  },

  ...(siteBasePath ? { basePath: siteBasePath } : {}),

  ...(siteBasePath && process.env.NODE_ENV === "development" ? {
    async redirects() {
      return [
        {
          source: "/",
          destination: siteBasePath,
          permanent: false,
          basePath: false,
        },
      ];
    },
  } : {}),
};

export default nextConfig;
