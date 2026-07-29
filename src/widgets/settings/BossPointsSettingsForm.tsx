"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  getBossPointsForSettings,
  updateBossPoints,
  type BossPointsRow,
} from "@/actions/bossPointsSettings";
import {
  getGuildStatus,
  updateGuildStatus,
  type GuildMode,
} from "@/actions/guildStatusSettings";

const CATEGORY_ORDER = ["Прайм", "АГЛ"];

export function BossPointsSettingsForm() {
  const [bosses, setBosses] = useState<BossPointsRow[] | null>(null);
  const [mode, setMode] = useState<GuildMode | null>(null);
  const [savingMode, setSavingMode] = useState(false);
  const [savingPoints, setSavingPoints] = useState(false);

  useEffect(() => {
    getBossPointsForSettings().then(setBosses);
    getGuildStatus().then((s) => setMode(s.mode));
  }, []);

  async function handleModeChange(value: GuildMode) {
    setMode(value);
    setSavingMode(true);
    try {
      await updateGuildStatus(value);
      toast.success("Статус гильдии сохранён");
    } catch {
      toast.error("Не удалось сохранить статус гильдии");
    } finally {
      setSavingMode(false);
    }
  }

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

  if (!bosses || !mode) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Очки боссов</h2>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>Текущий статус гильдии</Label>
        <Select
          value={mode}
          onValueChange={(v) => handleModeChange(v as GuildMode)}
          disabled={savingMode}
        >
          <SelectTrigger className="w-40 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="freeshard">
              Фришка
            </SelectItem>
            <SelectItem className="cursor-pointer" value="pvp">
              ПВП
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

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
