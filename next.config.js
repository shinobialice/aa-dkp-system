/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "archeagecodex.com",
      },
    ],
    // В проде что-то перед приложением (прокси/CDN у Coolify) дублирует
    // параметр "w" в запросах к встроенному оптимизатору /_next/image —
    // Next тогда отвечает 400 ("w" parameter cannot be an array), и все
    // иконки (LootIcon и т.п. — маленькие готовые картинки 22-40px, где
    // ресайз/webp от оптимизатора всё равно почти ничего не даёт) молча
    // не грузятся. Локально без этого слоя работает нормально. unoptimized
    // убирает сам /_next/image из цепочки — <Image> отдаёт src как есть,
    // без "w"/"q" в query, так что дублировать там нечему.
    unoptimized: true,
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
