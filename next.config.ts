import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Necessário para sites estáticos
  },
};

export default nextConfig;