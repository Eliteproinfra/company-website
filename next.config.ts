import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/property-management",
        destination: "/services/property-management",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
