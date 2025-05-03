"use client";

import { getLootGradeUrl, getLootIconUrl } from "./LootIcons";

interface LootIconProps {
  itemName: string;
  size?: number;
  className?: string;
}

export function LootIcon({
  itemName,
  size = 40,
  className = "",
}: LootIconProps) {
  const iconUrl = getLootIconUrl(itemName);
  const gradeUrl = getLootGradeUrl(itemName);

  return (
    <div
      className={`relative inline-block`}
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrl}
        alt={itemName}
        width={size}
        height={size}
        className={className}
      />
      <img
        src={gradeUrl}
        alt="grade"
        width={size}
        height={size}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
}
