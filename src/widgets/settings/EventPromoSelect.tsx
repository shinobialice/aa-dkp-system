import { PROMO_SLUGS, promoPath } from "@/shared/config/promoPages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

const NO_PROMO = "none";

type Props = {
  id: string;
  value: string | null;
  onChange: (promo: string | null) => void;
};

export default function EventPromoSelect({ id, value, onChange }: Props) {
  const handleChange = (next: string) => {
    onChange(next === NO_PROMO ? null : next);
  };

  return (
    <Select value={value ?? NO_PROMO} onValueChange={handleChange}>
      <SelectTrigger id={id} className="w-full cursor-pointer sm:w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={NO_PROMO}>
          Нет, только баннер на главной
        </SelectItem>
        {PROMO_SLUGS.map((slug) => (
          <SelectItem key={slug} className="cursor-pointer" value={slug}>
            {promoPath(slug).slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
