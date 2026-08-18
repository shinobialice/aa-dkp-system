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
  experimental: {
    serverActions: {
      // uploadAvatar/uploadEventBanner validate files up to 5 МБ (MAX_FILE_SIZE),
      // но Server Actions по умолчанию режут тело запроса на 1 МБ — без этого
      // любая картинка больше ~1 МБ падала с "Body exceeded 1 MB limit" раньше,
      // чем доходило до собственной проверки размера. 6mb — с запасом на
      // multipart-накладные расходы сверх 5 МБ файла.
      bodySizeLimit: "6mb",
    },
  },
};

module.exports = nextConfig;
