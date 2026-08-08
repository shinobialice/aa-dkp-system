import { Popover, PopoverAnchor, PopoverContent } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";

const packOptions = [3, 4, 5, 6, 7, 8];

export function PacksPopover({
  open,
  onOpenChange,
  onSelect,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (packs: number) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent align="center" className="w-auto">
        <div className="mb-2 text-center text-sm">Сколько паков?</div>
        <div className="flex gap-1">
          {packOptions.map((n) => (
            <Button
              key={n}
              type="button"
              size="sm"
              variant="outline"
              className="w-9 px-0 cursor-pointer"
              onClick={() => onSelect(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
