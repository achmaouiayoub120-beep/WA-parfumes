import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://192.168.3.6:3000', '192.168.3.6'],
  images: {
    qualities: [70, 75, 85, 100],
  },
};

export default nextConfig;
