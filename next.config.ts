import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/torre-technologies-co/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
