import { CLASS_ORDER } from "@/shared/config/classes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type Props = {
  value: string | null;
  onChange: (roleClass: string | null) => void;
};

const NO_CLASS = "none";

export default function ClassSelect({ value, onChange }: Props) {
  const handleChange = (next: string) => {
    onChange(next === NO_CLASS ? null : next);
  };

  return (
    <Select value={value ?? NO_CLASS} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        aria-label="Класс"
        className="w-auto cursor-pointer"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NO_CLASS}>Без класса</SelectItem>
        {CLASS_ORDER.map((roleClass) => (
          <SelectItem key={roleClass} value={roleClass}>
            {roleClass}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
