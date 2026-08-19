import Image from "next/image";
import { SEAL_ICON_URL, getSealGradeIconUrl } from "./sealsData";

type SealIconProps = {
  grade: number;
  size?: number;
  className?: string;
};

export default function SealIcon({ grade, size = 40, className }: SealIconProps) {
  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <Image
        src={SEAL_ICON_URL}
        alt="Печать"
        width={size}
        height={size}
        style={{ position: "relative", top: 0, left: 0 }}
      />
      <Image
        src={getSealGradeIconUrl(grade)}
        alt=""
        width={size}
        height={size}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}
