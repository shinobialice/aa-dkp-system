"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import type { SectionId } from "./settingsSections";

type DraftEntry = {
  section: SectionId;
  label: string;
  dirty: boolean;
  saved: unknown;
  save: () => Promise<void>;
  reset: () => void;
};

type DraftRegistry = {
  entries: Record<string, DraftEntry>;
  register: (id: string, entry: DraftEntry) => void;
  unregister: (id: string) => void;
};

const DraftContext = createContext<DraftRegistry | null>(null);

function useRegistry() {
  const registry = useContext(DraftContext);
  if (!registry) throw new Error("SettingsDraftProvider is missing");
  return registry;
}

export function SettingsDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entries, setEntries] = useState<Record<string, DraftEntry>>({});

  const register = useCallback((id: string, entry: DraftEntry) => {
    setEntries((previous) => ({ ...previous, [id]: entry }));
  }, []);
  const unregister = useCallback((id: string) => {
    setEntries((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ entries, register, unregister }),
    [entries, register, unregister],
  );

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

export function useSettingsDraft<T>({
  id,
  section,
  label,
  load,
  save,
}: {
  id: string;
  section: SectionId;
  label: string;
  load: () => Promise<T>;
  save: (value: T) => Promise<void>;
}) {
  const { register, unregister } = useRegistry();
  const [saved, setSaved] = useState<T | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const loadRef = useRef(load);
  const saveRef = useRef(save);

  useEffect(() => {
    loadRef.current = load;
    saveRef.current = save;
  });

  const reload = useCallback(() => {
    loadRef
      .current()
      .then((value) => {
        setSaved(value);
        setDraft(value);
      })
      .catch(() => toast.error(`Не удалось загрузить: ${label}`));
  }, [label]);

  useEffect(() => {
    reload();
  }, [reload]);

  const dirty = saved !== null && draft !== null && !same(saved, draft);

  useEffect(() => {
    register(id, {
      section,
      label,
      dirty,
      saved,
      save: async () => {
        if (draft === null) return;
        await saveRef.current(draft);
        setSaved(draft);
      },
      reset: () => setDraft(saved),
    });
  }, [id, section, label, dirty, saved, draft, register]);

  useEffect(() => () => unregister(id), [id, unregister]);

  const applySaved = useCallback((update: (value: T) => T) => {
    setSaved((value) => (value === null ? value : update(value)));
    setDraft((value) => (value === null ? value : update(value)));
  }, []);

  const changed = (pick: (value: T) => unknown) =>
    saved !== null && draft !== null && !same(pick(saved), pick(draft));

  return {
    value: draft,
    saved,
    setValue: setDraft as React.Dispatch<React.SetStateAction<T>>,
    dirty,
    changed,
    applySaved,
    reload,
  };
}

export function useSavedSetting<T>(id: string): T | null {
  const { entries } = useRegistry();
  return (entries[id]?.saved as T | undefined) ?? null;
}

export function useDirtySections() {
  const { entries } = useRegistry();
  const counts: Partial<Record<SectionId, number>> = {};
  for (const entry of Object.values(entries)) {
    if (entry.dirty) counts[entry.section] = (counts[entry.section] ?? 0) + 1;
  }
  return counts;
}

export function SettingsSaveBar() {
  const { entries } = useRegistry();
  const [saving, setSaving] = useState(false);
  const dirty = Object.values(entries).filter((entry) => entry.dirty);

  useEffect(() => {
    if (dirty.length === 0) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty.length]);

  if (dirty.length === 0) return null;

  const saveAll = async () => {
    setSaving(true);
    const results = await Promise.allSettled(
      dirty.map((entry) => entry.save()),
    );
    setSaving(false);
    const failed = dirty.filter((_, i) => results[i].status === "rejected");
    if (failed.length === 0) {
      toast.success("Настройки сохранены");
      return;
    }
    const reasons = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => (r.reason instanceof Error ? r.reason.message : ""))
      .filter(Boolean);
    toast.error(
      `Не сохранилось: ${failed.map((entry) => entry.label).join(", ")}`,
      { description: reasons[0] },
    );
  };

  return (
    <div
      role="status"
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[min(36rem,calc(100%-2rem))] -translate-x-1/2 items-center gap-2 rounded-2xl bg-foreground py-2.5 pr-2.5 pl-4 text-background shadow-xl md:bottom-6"
    >
      <span className="min-w-0 flex-1 text-sm">
        Не сохранено:{" "}
        <span className="font-semibold">
          {dirty.map((entry) => entry.label).join(", ")}
        </span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={saving}
        className="cursor-pointer text-background hover:bg-background/15 hover:text-background"
        onClick={() => dirty.forEach((entry) => entry.reset())}
      >
        Отменить
      </Button>
      <Button
        size="sm"
        disabled={saving}
        className="cursor-pointer"
        onClick={saveAll}
      >
        {saving ? "Сохранение…" : "Сохранить"}
      </Button>
    </div>
  );
}
