import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { PromoLink } from "@/shared/config/promoPages";

type Props = {
  promo: PromoLink;
  onNavigate: () => void;
};

export default function PromoSheetLink({ promo, onNavigate }: Props) {
  return (
    <Link
      href={promo.url}
      onClick={onNavigate}
      className="rainbow-surface flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 font-semibold"
    >
      <Sparkles className="size-5.5 shrink-0 text-fuchsia-500" />
      <span className="rainbow-text">{promo.title}</span>
    </Link>
  );
}
