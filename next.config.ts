import path from 'path';
import type { NextConfig } from "next";

const computedRoot = process.env.TURBOPACK_ROOT || path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: computedRoot,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
