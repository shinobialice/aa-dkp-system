import { Badge, Switch } from "@/shared/ui";
import { badgeColors } from "./tagStyles";

type Props = {
  label: string;
  checked: boolean;
  editable: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
};

export default function FlagRow({
  label,
  checked,
  editable,
  disabled,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between py-4">
      <Badge
        className="text-background"
        style={{ backgroundColor: badgeColors[label] }}
      >
        {label}
      </Badge>
      {editable && (
        <Switch
          className="cursor-pointer"
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      )}
    </div>
  );
}
