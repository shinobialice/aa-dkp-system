import Image from "next/image";
import { type Engraving } from "./itemsData/engravings";
import { getItemGradeIconUrl } from "./itemsData/paths";

export function EngravingIcon({
  engraving,
  size,
}: {
  engraving: Engraving;
  size: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={engraving.iconUrl}
        alt={engraving.name}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      <Image
        src={getItemGradeIconUrl(engraving.grade)}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
}
