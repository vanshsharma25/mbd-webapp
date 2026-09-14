import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mbd/domain"],
};

export default nextConfig;
