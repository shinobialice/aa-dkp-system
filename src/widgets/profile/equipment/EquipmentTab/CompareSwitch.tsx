import { Switch } from "@/shared/ui";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function CompareSwitch({ checked, onCheckedChange }: Props) {
  return (
    <label
      title="Показать разницу с вашим персонажем"
      className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-muted-foreground"
    >
      <Switch
        className="cursor-pointer"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      Сравнить
    </label>
  );
}
