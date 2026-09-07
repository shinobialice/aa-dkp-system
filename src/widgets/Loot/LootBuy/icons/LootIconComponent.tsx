"use client";

import Image from "next/image";

// Раньше рамка редкости грузилась напрямую с archeagecodex.com — на проде
// что-то по пути к /_next/image дублировало параметр "w", и иконки молча
// переставали грузиться (см. next.config.js: images.unoptimized). Плюс
// сам archeagecodex.com блокирует хотлинк-запросы с чужого домена. Держим
// 12 рамок локально (загружены через /api/uploads/grade-icons) — не
// зависим от внешнего хоста вообще.
const GRADE_URL = "/api/uploads/grade-icons/grade";

type LootIconProps = {
  itemName: string;
  iconUrl?: string | null;
  grade?: number | null;
  size?: number;
  className?: string;
};

export function LootIcon({
  itemName,
  iconUrl,
  grade,
  size = 40,
  className = "",
}: LootIconProps) {
  const gradeUrl = `${GRADE_URL}${grade ?? 1}.png`;

  return (
    <div
      className={`relative inline-block rounded bg-muted`}
      style={{ width: size, height: size }}
    >
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={itemName}
          width={size}
          height={size}
          className={className}
        />
      )}
      <Image
        src={gradeUrl}
        alt="grade"
        width={size}
        height={size}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
}
