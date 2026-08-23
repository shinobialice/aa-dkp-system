"use client";

import Image from "next/image";

const GRADE_URL = "https://archeagecodex.com/images/icon_grade";

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
