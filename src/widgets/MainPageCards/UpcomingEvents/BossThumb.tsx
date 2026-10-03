import Image from "next/image";
import { bossImages } from "@/shared/config/bossImages";

type Props = {
  boss: string;
  size: number;
};

export default function BossThumb({ boss, size }: Props) {
  const src = bossImages[boss];
  const sizeStyle = { width: size, height: size };

  if (!src) {
    return <span className="shrink-0 rounded-md bg-muted" style={sizeStyle} />;
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-md object-cover"
      style={sizeStyle}
    />
  );
}
