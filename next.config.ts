import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  turbopack: {},
  allowedDevOrigins: ["http://192.168.8.106:3000"], // your IP + port
};

export default nextConfig;
