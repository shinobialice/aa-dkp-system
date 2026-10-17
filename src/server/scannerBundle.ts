import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

// Установщик (.exe) лежит в релизе scanner-latest репозитория; можно
// переопределить переменной окружения, если файл переедет.
export const SCANNER_INSTALLER_URL =
  process.env.SCANNER_INSTALLER_URL ??
  "https://github.com/shinobialice/aa-dkp-system/releases/download/scanner-latest/CorvusScannerSetup.exe";

// Папка сканера киллкаунта в репозитории. На проде её кладёт в бандл
// outputFileTracingIncludes из next.config.js.
const SCANNER_DIR = path.join(process.cwd(), "tools", "corvus-pvp");
const ZIP_ROOT = "corvus-pvp";
const INCLUDE_EXTENSIONS = new Set([".py", ".bat", ".md", ".json"]);
// Локальные данные сканера (захваты, снимки с чужими никами, настройки) не раздаём.
const SKIP_DIRS = new Set(["__pycache__", "snapshots", "captures"]);
const SKIP_FILES = new Set(["corvus_scanner.json"]);

type ZipEntry = { name: string; data: Buffer };

async function collectScannerFiles(
  dir: string,
  prefix = "",
): Promise<ZipEntry[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: ZipEntry[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(
          ...(await collectScannerFiles(path.join(dir, entry.name), relative)),
        );
      }
      continue;
    }
    if (
      !entry.isFile() ||
      SKIP_FILES.has(entry.name) ||
      entry.name.includes(".local.") ||
      !INCLUDE_EXTENSIONS.has(path.extname(entry.name))
    ) {
      continue;
    }
    files.push({
      name: relative,
      data: await readFile(path.join(dir, entry.name)),
    });
  }
  return files;
}

// Минимальный ZIP (deflate, имена в UTF-8): хватает Проводнику Windows и 7-Zip.
export function buildZip(entries: ZipEntry[], date = new Date()): Buffer {
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    (date.getSeconds() >> 1);
  const dosDate =
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const compressed = deflateRawSync(entry.data);
    const crc = crc32(entry.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // имя в UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, name, compressed);
    centrals.push(central, name);
    offset += local.length + name.length + compressed.length;
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

export async function buildScannerZip(): Promise<Buffer> {
  const files = await collectScannerFiles(SCANNER_DIR);
  return buildZip(
    files.map((file) => ({ ...file, name: `${ZIP_ROOT}/${file.name}` })),
  );
}
