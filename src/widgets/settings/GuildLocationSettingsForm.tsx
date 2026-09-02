"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button, Label } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  getGuildStatus,
  updateGuildLocation,
  updateGuildStatus,
  type GuildFaction,
  type GuildMode,
} from "@/actions/guildStatusSettings";
import { GUILD_SERVERS, type GuildServer } from "@/utils/guildServers";

const FACTION_LABEL: Record<GuildFaction, string> = {
  nuian: "Запад (Нуиан)",
  hariharan: "Восток (Харихаран)",
};

const FACTION_ICON: Record<GuildFaction, string> = {
  nuian: "/images/server/west.png",
  hariharan: "/images/server/east.png",
};

const MODE_LABEL: Record<GuildMode, string> = {
  freeshard: "Фришка",
  pvp: "ПВП",
};

export function GuildLocationSettingsForm() {
  const [server, setServer] = useState<GuildServer | null>(null);
  const [faction, setFaction] = useState<GuildFaction | null>(null);
  const [mode, setMode] = useState<GuildMode | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getGuildStatus().then((s) => {
      setServer(s.server);
      setFaction(s.faction);
      setMode(s.mode);
    });
  }, []);

  async function handleSave() {
    if (!server || !faction || !mode) return;
    setSaving(true);
    try {
      await Promise.all([
        updateGuildLocation(server, faction),
        updateGuildStatus(mode),
      ]);
      toast.success("Статус гильдии сохранён");
    } catch {
      toast.error("Не удалось сохранить статус гильдии");
    } finally {
      setSaving(false);
    }
  }

  if (!server || !faction || !mode) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Текущий статус гильдии</h2>
      <p className="text-sm text-muted-foreground">
        Сервер и фракция отображаются на всех страницах сайта в шапке и
        боковом меню. Режим влияет на очки боссов и статистику войны.
      </p>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Label>Сервер</Label>
          <Select
            value={server}
            onValueChange={(v) => setServer(v as GuildServer)}
            disabled={saving}
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GUILD_SERVERS.map((s) => (
                <SelectItem className="cursor-pointer" key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Фракция</Label>
          <Select
            value={faction}
            onValueChange={(v) => setFaction(v as GuildFaction)}
            disabled={saving}
          >
            <SelectTrigger className="w-48 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FACTION_LABEL) as GuildFaction[]).map((f) => (
                <SelectItem className="cursor-pointer" key={f} value={f}>
                  <span className="flex items-center gap-2">
                    <Image
                      src={FACTION_ICON[f]}
                      alt=""
                      width={16}
                      height={16}
                    />
                    {FACTION_LABEL[f]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Режим</Label>
          <Select
            value={mode}
            onValueChange={(v) => setMode(v as GuildMode)}
            disabled={saving}
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(MODE_LABEL) as GuildMode[]).map((m) => (
                <SelectItem className="cursor-pointer" key={m} value={m}>
                  {MODE_LABEL[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Image
            src={FACTION_ICON[faction]}
            alt={FACTION_LABEL[faction]}
            width={24}
            height={24}
          />
          <span className="font-semibold">{server}</span>
          <span className="text-sm text-muted-foreground">
            {FACTION_LABEL[faction]}
          </span>
          <span className="text-sm text-muted-foreground">
            · {MODE_LABEL[mode]}
          </span>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="cursor-pointer"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
