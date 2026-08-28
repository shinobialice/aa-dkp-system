"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Label } from "@/shared/ui";
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
  type GuildFaction,
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

export function GuildLocationSettingsForm() {
  const [server, setServer] = useState<GuildServer | null>(null);
  const [faction, setFaction] = useState<GuildFaction | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getGuildStatus().then((s) => {
      setServer(s.server);
      setFaction(s.faction);
    });
  }, []);

  async function save(nextServer: GuildServer, nextFaction: GuildFaction) {
    setSaving(true);
    try {
      await updateGuildLocation(nextServer, nextFaction);
      toast.success("Сервер гильдии сохранён");
    } catch {
      toast.error("Не удалось сохранить сервер гильдии");
    } finally {
      setSaving(false);
    }
  }

  function handleServerChange(value: GuildServer) {
    setServer(value);
    if (faction) save(value, faction);
  }

  function handleFactionChange(value: GuildFaction) {
    setFaction(value);
    if (server) save(server, value);
  }

  if (!server || !faction) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Текущий сервер гильдии</h2>
      <p className="text-sm text-muted-foreground">
        Отображается на всех страницах сайта в шапке и боковом меню.
      </p>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Label>Сервер</Label>
          <Select
            value={server}
            onValueChange={(v) => handleServerChange(v as GuildServer)}
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
            onValueChange={(v) => handleFactionChange(v as GuildFaction)}
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
        </div>
      </div>
    </div>
  );
}
