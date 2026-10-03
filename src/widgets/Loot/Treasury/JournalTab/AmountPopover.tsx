"use client";

import { useId, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

type Props = {
  label: string;
  initial?: number;
  placeholder?: string;
  submitLabel: string;
  trigger: ReactNode;
  onSubmit: (value: number) => Promise<void>;
};

export default function AmountPopover({
  label,
  initial,
  placeholder,
  submitLabel,
  trigger,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputId = useId();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setValue(initial?.toString() ?? "");
  };

  const handleSubmit = async () => {
    const amount = Number(value);
    if (!value.trim() || Number.isNaN(amount)) return;
    setSaving(true);
    try {
      await onSubmit(amount);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось сохранить сумму");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-60 space-y-2 p-3">
        <Label htmlFor={inputId} className="text-xs">
          {label}
        </Label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            autoFocus
            type="number"
            inputMode="numeric"
            value={value}
            placeholder={placeholder}
            className="h-8"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
          />
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            {submitLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
