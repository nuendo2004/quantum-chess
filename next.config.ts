import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https", // You might want both http and https
        hostname: "**", // WARNING: Allows ANY hostname
        port: "",
        pathname: "**", // Allows any path
      },
      {
        protocol: "http", // Optional: if you need http sources too
        hostname: "**", // WARNING: Allows ANY hostname
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
