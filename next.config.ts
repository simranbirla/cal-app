import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "utfs.io", port: "", protocol: "https" },
      {
        hostname: "lh3.googleusercontent.com", protocol: "https"
      },
      {
        hostname: "avatars.githubusercontent.com",
        port: "",
        protocol: "https",
      },
      { hostname: "avatar.vercel.sh", port: "", protocol: "https" },

    ],
  },

};

export default nextConfig;
