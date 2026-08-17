/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "archeagecodex.com",
      },
    ],
  },
};

module.exports = nextConfig;
