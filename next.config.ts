import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  basePath: "",
  assetPrefix: "./",
  trailingSlash: true,
  webpack: (
    config: Configuration,
    { isServer, dev }: { isServer: boolean; dev: boolean }
  ) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  transpilePackages: ["wagmi", "viem"],
};

export default nextConfig;
