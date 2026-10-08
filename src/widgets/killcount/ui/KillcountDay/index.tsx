"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button, Segmented } from "@/shared/ui";
import type { KillCount } from "../../types";
import { updateKillCountById } from "../../api/history";
import { addKillCountRowToday } from "../../api/current";
import { KillCountEditModal } from "../killcount-edit-modal";
import {
  honor,
  kills,
  sortRows,
  type KillRow,
  type SortKey,
} from "../killcountModel";
import { formatNumber } from "@/shared/lib/format";
import Podium from "./Podium";
import KillTable from "./KillTable";
import KillCards from "./KillCards";
import DaySummary from "./DaySummary";
import type { RowListProps } from "./rowListProps";

export function KillcountDay({
  data,
  mode,
  isCanEdit,
  onDraftChange,
  canAddToday = false,
}: {
  data: KillRow[];
  mode: "saved" | "draft";
  isCanEdit: boolean;
  onDraftChange?: (rows: KillCount[]) => void;
  canAddToday?: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<KillRow[]>(data);
  const [sortKey, setSortKey] = useState<SortKey>("kills");
  const [search, setSearch] = useState("");
  const [rowToEdit, setRowToEdit] = useState<KillRow>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    setRows(data);
  }

  const sorted = useMemo(() => sortRows(rows, sortKey), [rows, sortKey]);
  const byKills = useMemo(() => sortRows(rows, "kills"), [rows]);
  const term = search.trim().toLowerCase();
  const shown = term
    ? sorted.filter((row) => row.userName.toLowerCase().includes(term))
    : sorted;
  const maxKills = Math.max(0, ...rows.map(kills));
  const totalKills = rows.reduce((sum, row) => sum + kills(row), 0);
  const totalHonor = rows.reduce((sum, row) => sum + honor(row), 0);
  const placeOf = (row: KillRow) => sorted.indexOf(row) + 1;

  const replaceRows = (next: KillRow[]) => {
    setRows(next);
    if (mode === "draft") onDraftChange?.(next as KillCount[]);
  };

  const handleSubmit = async (value: KillCount) => {
    if (mode === "draft") {
      replaceRows(
        rowToEdit
          ? rows.map((row) =>
              row.id === rowToEdit.id ? { ...row, ...value } : row,
            )
          : [...rows, value],
      );
      return;
    }
    if (!rowToEdit) {
      try {
        await addKillCountRowToday(value);
        toast.success(`${value.userName} добавлен`);
        router.refresh();
      } catch {
        toast.error("Не удалось добавить", {
          description: "Проверьте, что ник совпадает с ником на сайте",
        });
      }
      return;
    }
    try {
      await updateKillCountById(value);
      setRows((previous) =>
        previous.map((row) =>
          row.id === value.id ? { ...row, ...value } : row,
        ),
      );
      toast.success("Сохранено");
    } catch {
      toast.error("Не удалось сохранить строку");
    }
  };

  const openEdit = (row?: KillRow) => {
    setRowToEdit(row);
    setDialogOpen(true);
  };

  const listProps: RowListProps = {
    rows: shown,
    maxKills,
    placeOf,
    isCanEdit,
    renderEdit: (row) =>
      isCanEdit && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Изменить: ${row.userName}`}
          className="cursor-pointer text-muted-foreground"
          onClick={(event) => {
            event.stopPropagation();
            openEdit(row);
          }}
        >
          <Pencil className="size-3.5" />
        </Button>
      ),
  };

  return (
    <div className="flex flex-col gap-4">
      <DaySummary
        totalKills={totalKills}
        totalHonor={totalHonor}
        playerCount={rows.length}
      />

      {byKills.length > 0 && <Podium rows={byKills.slice(0, 3)} />}

      <section className="@container/kills flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
          <label className="relative flex min-w-48 flex-1 items-center sm:max-w-64">
            <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по нику"
              aria-label="Поиск по нику"
              className="h-9 w-full rounded-lg border bg-background pr-3 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              label="Сортировка"
              value={sortKey}
              onChange={setSortKey}
              options={[
                { value: "kills", label: "По килам" },
                { value: "honor", label: "По хонору" },
              ]}
            />
            {(mode === "draft" || canAddToday) && isCanEdit && (
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={() => openEdit()}
              >
                <Plus /> Добавить
              </Button>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            {rows.length === 0 ? "Пока никого нет" : "Никого не найдено"}
          </p>
        ) : (
          <div className="max-h-[min(30rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
            <KillTable {...listProps} />
            <KillCards {...listProps} />
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 border-t bg-muted px-3.5 py-2.5 font-semibold tabular-nums">
          <span>Итого</span>
          <span>
            {formatNumber(totalKills)} килов · {formatNumber(totalHonor)} хонора
          </span>
        </div>
      </section>

      <KillCountEditModal
        isVisible={dialogOpen}
        setIsVisible={setDialogOpen}
        resetEditValue={() => setRowToEdit(undefined)}
        onSubmit={handleSubmit}
        rowToEdit={rowToEdit}
      />
    </div>
  );
}
