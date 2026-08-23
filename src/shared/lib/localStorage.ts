import "server-only";
import { promises as fs } from "fs";
import path from "path";

// Замена Supabase Storage: файлы (аватарки, баннер ивента, иконки предметов)
// хранятся на диске сервера, в папке, примонтированной как persistent volume
// в Coolify — так они переживают передеплой. Раздаются через
// /api/uploads/[...path].
const UPLOADS_DIR = process.env.UPLOADS_DIR || "/data/uploads";

// Тот же список MIME-типов, что и в ALLOWED_TYPES вызывающих Server Actions —
// расширение в имени файла нужно API-роуту /api/uploads, чтобы отдать
// правильный Content-Type (см. CONTENT_TYPES там же). Без расширения роут
// отдавал бы application/octet-stream: обычный <img> (аватар, баннер) всё
// равно распознаёт картинку по байтам, а вот встроенный оптимизатор
// next/image (LootIcon и т.п.) — нет, и падает с ошибкой рендера.
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function saveUploadedFile(
  bucket: string,
  relativePath: string,
  file: File,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXTENSION_BY_MIME[file.type] ?? "";
  const finalPath = `${relativePath}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, bucket, finalPath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);
  // Путь от корня, без хоста: next/image (LootIcon и т.п.) требует either
  // локальный путь, либо хост из images.remotePatterns — с абсолютным
  // getBaseUrl() (localhost в деве, другой домен на проде) пришлось бы
  // держать это в next.config.js синхронно под каждое окружение. Обычные
  // <img> (аватар, баннер ивента) с относительным путём работают точно так
  // же.
  return `/api/uploads/${bucket}/${finalPath}`;
}
