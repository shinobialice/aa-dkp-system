"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type {
  ArenaFighter,
  ArenaKillcount,
} from "@/server/killcountArena/types";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button, Input } from "@/shared/ui";
import ArenaPanel from "@/widgets/arena/ArenaPanel";
import SkewTabs from "@/widgets/arena/SkewTabs";
import { updateKillCountById } from "../../api/history";
import type { KillCount } from "../../types";
import { KillCountEditModal } from "../../ui/killcount-edit-modal";
import type { SortKey } from "../../ui/killcountModel";
import FighterList from "./FighterList";
import { fightersText } from "./killcountArenaModel";

type Props = {
  killcount: ArenaKillcount;
  canEdit: boolean;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "kills", label: "Киллы" },
  { value: "honor", label: "Хонор" },
];

export default function FightersPanel({ killcount, canEdit }: Props) {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("kills");
  const [search, setSearch] = useState("");
  const [rowToEdit, setRowToEdit] = useState<ArenaFighter>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canEditRows = canEdit && killcount.canEditRows;

  const handleSubmit = async (value: KillCount) => {
    try {
      await updateKillCountById(value);
      toast.success("Сохранено");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить строку"));
    }
  };

  const openEdit = (fighter: ArenaFighter) => {
    setRowToEdit(fighter);
    setIsDialogOpen(true);
  };

  return (
    <ArenaPanel
      title="Бойцы"
      meta={`${fightersText(killcount.fighters.length)} в киллкаунте`}
      className="gap-0 p-0 sm:p-0 [&>div:first-child]:px-5 [&>div:first-child]:pt-4 [&>div:first-child]:pb-3"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по нику"
            aria-label="Поиск по нику"
            className="h-8 w-40 rounded-none"
          />
          <SkewTabs
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
            label="Сортировка бойцов"
          />
        </div>
      }
    >
      <div className="border-t">
        <FighterList
          fighters={killcount.fighters}
          sort={sort}
          window={killcount.window}
          search={search}
          renderAction={
            canEditRows
              ? (fighter) => (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Изменить: ${fighter.userName}`}
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => openEdit(fighter)}
                  >
                    <Pencil />
                  </Button>
                )
              : undefined
          }
        />
      </div>
      {canEditRows && (
        <KillCountEditModal
          isVisible={isDialogOpen}
          setIsVisible={setIsDialogOpen}
          resetEditValue={() => setRowToEdit(undefined)}
          onSubmit={handleSubmit}
          rowToEdit={rowToEdit}
        />
      )}
    </ArenaPanel>
  );
}
