/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['archeagecodex.com'],
  },
  sentry: {
    reactComponentAnnotation: false,
  },
};

module.exports = nextConfig;
