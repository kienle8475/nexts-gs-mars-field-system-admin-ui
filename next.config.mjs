/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: "/admin",
  assetPrefix: "/admin",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_IMAGE_DOMAIN,
      },
    ],
  },
};

export default nextConfig;
