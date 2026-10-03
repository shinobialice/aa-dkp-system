import { cn } from "@/shared/lib/tw-merge";

const PODIUM_PLACES = 3;

type Props = {
  place: number;
};

export default function PlaceNumber({ place }: Props) {
  return (
    <span
      className={cn(
        "tabular-nums",
        place <= PODIUM_PLACES
          ? "font-bold text-foreground"
          : "font-medium text-muted-foreground",
      )}
    >
      {place}
    </span>
  );
}
