import Image from "next/image";
import type { GearItem } from "./itemsData";
import { getItemGradeIconUrl, getItemOverlayUrl } from "./itemsData/paths";

// size задан — фиксированные пиксели (списки/попапы). size не задан —
// иконка растягивается на весь родитель через fill (кнопка слота, где
// родитель уже имеет нужный размер через Tailwind size-* и не должен
// зависеть от breakpoint'ов).
export function GearItemIcon({
  item,
  grade,
  size,
  className = "",
}: {
  item: GearItem;
  grade: number;
  size?: number;
  className?: string;
}) {
  const overlayUrl = getItemOverlayUrl(item.sealIconUrl);
  if (size == null) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <Image
          unoptimized
          src={item.iconUrl}
          alt={item.name}
          fill
          sizes="44px"
          className="object-contain"
        />
        {overlayUrl && (
          <Image
            unoptimized
            src={overlayUrl}
            alt=""
            fill
            sizes="44px"
            className="object-contain"
          />
        )}
        <Image
          unoptimized
          src={getItemGradeIconUrl(grade)}
          alt=""
          fill
          sizes="44px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        unoptimized
        src={item.iconUrl}
        alt={item.name}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      {overlayUrl && (
        <Image
          unoptimized
          src={overlayUrl}
          alt=""
          width={size}
          height={size}
          className="absolute inset-0"
        />
      )}
      <Image
        unoptimized
        src={getItemGradeIconUrl(grade)}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
}
