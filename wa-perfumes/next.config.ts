import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://192.168.3.6:3000', '192.168.3.6'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75, 80, 85, 90, 100],
  },
};

export default nextConfig;
