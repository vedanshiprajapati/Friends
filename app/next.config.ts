import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // @ will point to the 'src' folder
    };
    return config;
  },
};

export default nextConfig;
