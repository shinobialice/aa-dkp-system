import { X } from "lucide-react";
import { Button } from "@/shared/ui";

export default function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Удалить"
      className="ml-auto size-7 shrink-0 cursor-pointer text-muted-foreground"
      onClick={onClick}
    >
      <X />
    </Button>
  );
}
