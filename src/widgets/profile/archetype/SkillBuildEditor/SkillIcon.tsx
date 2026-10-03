import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";

export default function SkillIcon({
  src,
  alt,
  size,
  dimmed,
}: {
  src: string;
  alt: string;
  size: number;
  dimmed?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={cn("rounded", dimmed && "opacity-70 grayscale-[70%]")}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
