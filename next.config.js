/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["archeagecodex.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
