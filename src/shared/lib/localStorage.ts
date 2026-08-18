import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getBaseUrl } from "@/shared/lib";

// Замена Supabase Storage: файлы (аватарки, баннер ивента) хранятся на диске
// сервера, в папке, примонтированной как persistent volume в Coolify — так
// они переживают передеплой. Раздаются через /api/uploads/[...path].
const UPLOADS_DIR = process.env.UPLOADS_DIR || "/data/uploads";

export async function saveUploadedFile(
  bucket: string,
  relativePath: string,
  file: File,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const targetPath = path.join(UPLOADS_DIR, bucket, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);
  return `${getBaseUrl()}/api/uploads/${bucket}/${relativePath}`;
}
