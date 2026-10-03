"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/shared/ui";
import { KNOWN_BOSS_NAMES } from "./missingModel";

type Props = {
  onAdd: (date: string, time: string, bossName: string) => Promise<boolean>;
};

export default function AddMissingSlotForm({ onAdd }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bossName, setBossName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const boss = bossName.trim();
    if (!date || !time || !boss) return;
    setAdding(true);
    const added = await onAdd(date, time, boss);
    if (added) setBossName("");
    setAdding(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-background p-2"
    >
      <Input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="h-8 w-36 text-xs"
        required
      />
      <Input
        type="time"
        value={time}
        onChange={(event) => setTime(event.target.value)}
        className="h-8 w-24 text-xs"
        required
      />
      <Input
        list="missing-activity-boss-names"
        placeholder="Босс"
        value={bossName}
        onChange={(event) => setBossName(event.target.value)}
        className="h-8 min-w-24 flex-1 text-xs"
        required
      />
      <datalist id="missing-activity-boss-names">
        {KNOWN_BOSS_NAMES.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <Button
        type="submit"
        size="sm"
        className="h-8 cursor-pointer text-xs"
        disabled={adding}
      >
        Добавить
      </Button>
    </form>
  );
}
