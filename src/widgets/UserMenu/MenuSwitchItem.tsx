import type { ReactNode } from "react";
import { DropdownMenuItem, Switch } from "@/shared/ui";

type Props = {
  icon: ReactNode;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function MenuSwitchItem({
  icon,
  label,
  checked,
  disabled,
  onChange,
}: Props) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={(event) => {
        event.preventDefault();
        onChange(!checked);
      }}
      className="cursor-pointer py-2"
    >
      {icon}
      <span className="flex-1">{label}</span>
      <Switch checked={checked} tabIndex={-1} className="pointer-events-none" />
    </DropdownMenuItem>
  );
}
