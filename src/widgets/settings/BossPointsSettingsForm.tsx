"use client";

import { Input } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  getBossPointsForSettings,
  updateBossPoints,
  type BossPointsRow,
} from "@/actions/bossPointsSettings";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingsCard } from "./settingsUi";

const CATEGORY_ORDER = ["Прайм", "АГЛ"];

export function BossPointsSettingsForm() {
  const points = useSettingsDraft<BossPointsRow[]>({
    id: "bossPoints",
    section: "points",
    label: "Очки боссов",
    load: getBossPointsForSettings,
    save: (rows) =>
      updateBossPoints(
        rows.map((b) => ({
          id: b.id,
          freeshard: b.dkp_points_freeshard,
          pvp: b.dkp_points_pvp,
        })),
      ),
  });

  const bosses = points.value;
  if (!bosses) return <Loading />;

  const setPoint = (
    id: number,
    field: "dkp_points_freeshard" | "dkp_points_pvp",
    value: string,
  ) =>
    points.setValue((rows) =>
      rows.map((b) => (b.id === id ? { ...b, [field]: Number(value) } : b)),
    );

  return (
    <SettingsCard title="Очки боссов" hint="сколько баллов даёт босс">
      {CATEGORY_ORDER.map((category) => {
        const rows = bosses.filter((b) => b.category === category);
        if (rows.length === 0) return null;
        return (
          <div key={category} className="px-4 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] items-center gap-x-3 gap-y-1.5">
              <span className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
                {category}
              </span>
              <span className="text-right text-xs text-muted-foreground">
                Фришка
              </span>
              <span className="text-right text-xs text-muted-foreground">
                ПВП
              </span>
              {rows.map((b) => {
                const changed = points.changed((all) =>
                  all.find((x) => x.id === b.id),
                );
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "col-span-3 -mx-2 grid grid-cols-subgrid items-center rounded-md px-2 py-0.5",
                      changed && "bg-amber-50 dark:bg-amber-500/10",
                    )}
                  >
                    <span className="truncate">{b.boss_name}</span>
                    <Input
                      type="number"
                      aria-label={`${b.boss_name}, фришка`}
                      className="h-8 text-right"
                      value={b.dkp_points_freeshard}
                      onChange={(e) =>
                        setPoint(b.id, "dkp_points_freeshard", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      aria-label={`${b.boss_name}, ПВП`}
                      className="h-8 text-right"
                      value={b.dkp_points_pvp}
                      onChange={(e) =>
                        setPoint(b.id, "dkp_points_pvp", e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </SettingsCard>
  );
}
