import Image from "next/image";
import { type Rune } from "./itemsData/runes";
import { getItemGradeIconUrl } from "./itemsData/paths";

export function RuneIcon({ rune, size }: { rune: Rune; size: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={rune.iconUrl}
        alt={rune.name}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      <Image
        src={getItemGradeIconUrl(rune.grade)}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
}
