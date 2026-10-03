import type { UserSeal } from "@/actions/getUserSeals";
import SealCard from "./SealCard";
import { MAX_USER_SEALS } from "./sealsData";

export default function SealsGrid({ seals }: { seals: UserSeal[] }) {
  if (seals.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Печати не выбраны
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-3">
      {Array.from({ length: MAX_USER_SEALS }, (_, index) => {
        const seal = seals[index];
        if (!seal) {
          return (
            <div
              key={`empty-${index}`}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground"
            >
              Не выбрано
            </div>
          );
        }
        return (
          <SealCard key={seal.id} name={seal.seal_name} level={seal.level} />
        );
      })}
    </div>
  );
}
