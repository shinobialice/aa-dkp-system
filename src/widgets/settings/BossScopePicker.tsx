import { Checkbox } from "@/shared/ui";
import { type BossPointsRow } from "@/actions/bossPointsSettings";

const CATEGORY_ORDER = ["Прайм", "АГЛ"];

const AGL_BOSS_ORDER = ["АГЛ", "Морф", "Марли Прок", "Кошка"];

export type BossOption = Pick<BossPointsRow, "id" | "boss_name" | "category">;

export default function BossScopePicker({
  bosses,
  bossIds,
  onChange,
}: {
  bosses: BossOption[];
  bossIds: number[];
  onChange: (bossIds: number[]) => void;
}) {
  return (
    <div className="space-y-2">
      {CATEGORY_ORDER.map((category) => {
        const categoryBosses = bosses
          .filter((b) => b.category === category)
          .sort((a, b) => {
            if (category !== "АГЛ") return 0;
            return (
              AGL_BOSS_ORDER.indexOf(a.boss_name) -
              AGL_BOSS_ORDER.indexOf(b.boss_name)
            );
          });
        if (categoryBosses.length === 0) return null;

        const allSelected = categoryBosses.every((b) => bossIds.includes(b.id));

        function toggleAll(checked: boolean) {
          const others = bossIds.filter(
            (id) => !categoryBosses.some((b) => b.id === id),
          );
          onChange(
            checked ? [...others, ...categoryBosses.map((b) => b.id)] : others,
          );
        }

        function toggleBoss(bossId: number, checked: boolean) {
          onChange(
            checked
              ? [...bossIds, bossId]
              : bossIds.filter((id) => id !== bossId),
          );
        }

        return (
          <div key={category} className="rounded-md border p-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <Checkbox
                className="cursor-pointer"
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
              />
              {category}
            </label>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 pl-6 text-sm text-muted-foreground">
              {categoryBosses.map((b) => (
                <label
                  key={b.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={bossIds.includes(b.id)}
                    onCheckedChange={(checked) =>
                      toggleBoss(b.id, checked === true)
                    }
                  />
                  {b.boss_name}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
