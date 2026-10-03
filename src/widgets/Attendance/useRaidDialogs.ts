"use client";

import { useState } from "react";
import { getRaidById, type RaidDetails } from "@/actions/getRaidById";

type Editor = { open: boolean; mode: "create" | "edit" };

export function useRaidDialogs() {
  const [raid, setRaid] = useState<RaidDetails | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [editor, setEditor] = useState<Editor>({ open: false, mode: "create" });

  const openRaid = async (id: number) => {
    setRaid(await getRaidById(String(id)));
    setInfoOpen(true);
  };

  const startCreate = () => setEditor({ open: true, mode: "create" });

  const startEdit = () => {
    setInfoOpen(false);
    setEditor({ open: true, mode: "edit" });
  };

  const setEditorOpen = (open: boolean) => {
    setEditor((current) => ({ ...current, open }));
  };

  return {
    raid,
    infoOpen,
    setInfoOpen,
    editor,
    setEditorOpen,
    openRaid,
    startCreate,
    startEdit,
  };
}
