/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "archeagecodex.com",
      },
    ],
    // ВРЕМЕННО было unoptimized: true — на archeagecodex.com-ссылках прод
    // отвечал 400 на /_next/image ("w" parameter cannot be an array), из-за
    // чего иконки не грузились. Но unoptimized отключает ресайз/webp вообще
    // для ВСЕХ картинок на сайте (аватарки, баннер ивента и т.п.), а не
    // только для мелких иконок — отсюда заметно более долгая загрузка
    // страниц. Теперь все бывшие archeagecodex.com-ссылки перевезены на свой
    // хостинг (/api/uploads/...) — проверяем, был ли баг завязан именно на
    // архейджкодекс (внешний "чужой" URL внутри query) или общий для любого
    // /_next/image. Если после этого иконки снова пропадут — значит общий,
    // возвращаем unoptimized: true обратно.
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
