"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ShieldCheck, X } from "lucide-react";
import { Button } from "@/shared/ui";
import calculateGuildTenureBonus from "@/utils/calculateGuildTenureBonus";
import { calculatePenaltyPercent } from "@/utils/calculateSalaryWeight";
import { deleteUserSalaryBonus } from "@/actions/addUserSalaryBonus";
import { getUserSalaryBonus } from "@/actions/getUserSalaryBonus";
import {
  deleteUserPenaltyPoints,
  getUserPenaltyPoints,
} from "@/actions/penaltyActions";
import AddSalaryBonusDialog from "./AddSalaryBonusDialog";
import AddPenaltyPointsDialog from "./AddPenaltyPointsDialog";
import { UserTagsSection } from "./UserTagsSection";

type Entry = { id: number; amount: number; reason: string };

const MONTH = new Date().toLocaleDateString("ru-RU", { month: "long" });

function formatPercent(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
}

function Row({
  title,
  hint,
  value,
  positive,
  onRemove,
}: {
  title: string;
  hint: string;
  value: string;
  positive: boolean | null;
  onRemove?: () => void;
}) {
  return (
    <li className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto_32px] items-center gap-2.5 border-t border-border/60 px-2.5 py-1.5">
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <span
        className={
          positive === null
            ? "font-bold text-muted-foreground tabular-nums"
            : positive
              ? "font-bold text-green-700 tabular-nums dark:text-green-400"
              : "font-bold text-red-700 tabular-nums dark:text-red-400"
        }
      >
        {value}
      </span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Убрать: ${title}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : (
        <span />
      )}
    </li>
  );
}

export default function ProfileSalaryTab({
  user,
  salary,
  tags,
  setTags,
  setUser,
  averageGuildGS,
  isAdmin,
}: {
  user: any;
  salary: number | null;
  tags: { id: number; tag: string }[];
  setTags: (tags: { id: number; tag: string }[]) => void;
  setUser: (user: any) => void;
  averageGuildGS: number;
  isAdmin: boolean;
}) {
  const [bonuses, setBonuses] = useState<Entry[]>([]);
  const [penalties, setPenalties] = useState<Entry[]>([]);
  const [version, setVersion] = useState(0);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const reload = () => setVersion((value) => value + 1);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getUserSalaryBonus(user.id),
      getUserPenaltyPoints(user.id),
    ]).then(([bonusRows, penaltyRows]) => {
      if (cancelled) return;
      setBonuses(bonusRows as Entry[]);
      setPenalties(penaltyRows as Entry[]);
    });
    return () => {
      cancelled = true;
    };
  }, [user.id, version]);

  const tenureBonus = calculateGuildTenureBonus(user.joined_at ?? null);
  const penaltyPoints = penalties.reduce(
    (sum, penalty) => sum + Number(penalty.amount),
    0,
  );
  const penaltyPercent = calculatePenaltyPercent(penaltyPoints);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <section
        aria-label="Из чего складывается зарплата"
        className="flex flex-col rounded-xl border bg-card"
      >
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2.5 sm:px-[18px]">
          <div>
            <h2 className="text-[15px] font-semibold">
              Из чего складывается зарплата
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Бонусы и штрафы применяются по очереди, см. «Основную информацию»,
              п. 3
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xl font-bold tabular-nums">
              <Image
                src="https://archeagecodex.com/items/gold.png"
                alt=""
                width={16}
                height={16}
              />
              {salary != null ? salary.toLocaleString("ru-RU") : "—"}
            </div>
            <div className="text-xs text-muted-foreground">за {MONTH}</div>
          </div>
        </div>

        <ul className="px-1.5 pb-1.5 sm:px-2">
          <Row
            title="Бонус за стаж"
            hint="10% за первое полугодие и по 5% за каждое следующее"
            value={`+${tenureBonus}%`}
            positive={tenureBonus > 0 ? true : null}
          />
          {bonuses.map((bonus) => (
            <Row
              key={`bonus-${bonus.id}`}
              title={bonus.reason}
              hint="личный бонус"
              value={`+${bonus.amount}%`}
              positive
              onRemove={
                isAdmin
                  ? async () => {
                      await deleteUserSalaryBonus(bonus.id);
                      reload();
                    }
                  : undefined
              }
            />
          ))}
          {penalties.map((penalty) => (
            <Row
              key={`penalty-${penalty.id}`}
              title={penalty.reason}
              hint="штрафные баллы"
              value={String(penalty.amount)}
              positive={false}
              onRemove={
                isAdmin
                  ? async () => {
                      await deleteUserPenaltyPoints(penalty.id);
                      reload();
                    }
                  : undefined
              }
            />
          ))}
          <Row
            title="Итого штрафов"
            hint={
              penaltyPoints > 0
                ? `${penaltyPoints} — минус ${formatPercent(penaltyPercent)}% к зарплате`
                : "штрафов нет"
            }
            value={
              penaltyPoints > 0
                ? `−${formatPercent(Math.min(100, penaltyPercent))}%`
                : "0%"
            }
            positive={penaltyPoints > 0 ? false : null}
          />
        </ul>

        {isAdmin && (
          <div className="flex gap-2 border-t border-border/60 px-4 pt-3 pb-4 sm:px-[18px]">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setBonusDialogOpen(true)}
            >
              <Plus />
              Бонус
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setPenaltyDialogOpen(true)}
            >
              <Plus />
              Штраф
            </Button>
          </div>
        )}
      </section>

      {isAdmin && (
        <section
          aria-label="Теги"
          className="flex flex-col rounded-xl border bg-card"
        >
          <div className="flex items-center gap-2 px-4 pt-4 pb-2 sm:px-[18px]">
            <h2 className="text-[15px] font-semibold">Теги</h2>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              видно только администрации
            </span>
          </div>
          <div className="px-4 pb-4 sm:px-[18px]">
            <UserTagsSection
              user={user}
              onUpdate={() => {}}
              tags={tags}
              setTags={setTags}
              setUser={setUser}
              averageGuildGS={averageGuildGS}
              isAdmin={isAdmin}
            />
          </div>
        </section>
      )}

      {isAdmin && (
        <>
          <AddSalaryBonusDialog
            open={bonusDialogOpen}
            onClose={() => setBonusDialogOpen(false)}
            userId={user.id}
            onAdded={reload}
          />
          <AddPenaltyPointsDialog
            open={penaltyDialogOpen}
            onClose={() => setPenaltyDialogOpen(false)}
            userId={user.id}
            onAdded={reload}
          />
        </>
      )}
    </div>
  );
}
