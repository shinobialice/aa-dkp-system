"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import {
  getBossPointsForSettings,
  updateBossPoints,
  type BossPointsRow,
} from "@/actions/bossPointsSettings";

const CATEGORY_ORDER = ["Прайм", "АГЛ"];

export function BossPointsSettingsForm() {
  const [bosses, setBosses] = useState<BossPointsRow[] | null>(null);
  const [savingPoints, setSavingPoints] = useState(false);

  useEffect(() => {
    getBossPointsForSettings().then(setBosses);
  }, []);

  function handlePointChange(
    id: number,
    field: "dkp_points_freeshard" | "dkp_points_pvp",
    value: string,
  ) {
    setBosses(
      (prev) =>
        prev?.map((b) =>
          b.id === id ? { ...b, [field]: Number(value) } : b,
        ) ?? null,
    );
  }

  async function handleSavePoints() {
    if (!bosses) return;
    setSavingPoints(true);
    try {
      await updateBossPoints(
        bosses.map((b) => ({
          id: b.id,
          freeshard: b.dkp_points_freeshard,
          pvp: b.dkp_points_pvp,
        })),
      );
      toast.success("Очки боссов сохранены");
    } catch {
      toast.error("Не удалось сохранить очки боссов");
    } finally {
      setSavingPoints(false);
    }
  }

  if (!bosses) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Очки боссов</h2>

      {CATEGORY_ORDER.map((category) => {
        const rows = bosses.filter((b) => b.category === category);
        if (rows.length === 0) return null;

        return (
          <div key={category} className="space-y-2 border rounded-lg p-3">
            <p className="font-semibold">{category}</p>
            <div className="grid grid-cols-[1fr_80px_80px] items-center gap-2 text-sm text-muted-foreground">
              <span></span>
              <span>Фришка</span>
              <span>ПВП</span>
            </div>
            {rows.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-[1fr_80px_80px] items-center gap-2"
              >
                <span className="text-sm">{b.boss_name}</span>
                <Input
                  type="number"
                  className="w-20"
                  value={b.dkp_points_freeshard}
                  onChange={(e) =>
                    handlePointChange(
                      b.id,
                      "dkp_points_freeshard",
                      e.target.value,
                    )
                  }
                />
                <Input
                  type="number"
                  className="w-20"
                  value={b.dkp_points_pvp}
                  onChange={(e) =>
                    handlePointChange(b.id, "dkp_points_pvp", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        );
      })}

      <Button
        onClick={handleSavePoints}
        disabled={savingPoints}
        className="cursor-pointer"
      >
        {savingPoints ? "Сохранение..." : "Сохранить очки"}
      </Button>
    </div>
  );
}
