/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "archeagecodex.com",
      },
    ],
  },
  // Файлы сканера киллкаунта для /api/killcount/scanner (src/server/scannerBundle.ts).
  outputFileTracingIncludes: {
    "/api/killcount/scanner": ["./tools/corvus-pvp/**/*"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
