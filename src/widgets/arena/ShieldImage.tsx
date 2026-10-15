import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  rimClassName?: string;
};

export default function ShieldImage({
  src,
  alt,
  sizes,
  className,
  rimClassName = "arena-rim",
}: Props) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div className={cn("arena-shield absolute inset-0", rimClassName)} />
      <div className="arena-shield absolute inset-[3px] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  );
}
