import type { PromoCharacter } from "@/actions/promoQuestActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

const NO_PARTNER = "none";

type Props = {
  id: string;
  partners: PromoCharacter[];
  value: number | null;
  onChange: (partnerId: number | null) => void;
};

export default function PartnerSelect({
  id,
  partners,
  value,
  onChange,
}: Props) {
  const handleChange = (next: string) => {
    onChange(next === NO_PARTNER ? null : Number(next));
  };

  return (
    <Select
      value={value === null ? NO_PARTNER : String(value)}
      onValueChange={handleChange}
    >
      <SelectTrigger id={id} className="w-full cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={NO_PARTNER}>
          Ни с кем, свой счет
        </SelectItem>
        {partners.map((partner) => (
          <SelectItem
            key={partner.id}
            className="cursor-pointer"
            value={String(partner.id)}
          >
            {partner.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
