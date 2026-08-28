import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker multi-stage build: outputs a minimal standalone bundle
  output: "standalone",
};

export default nextConfig;
