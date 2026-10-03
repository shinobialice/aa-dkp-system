"use client";
import type { ProfileUser } from "@/actions/getUser";

import { useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button, GOLD_ICON_URL } from "@/shared/ui";
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
import AdminTagsPanel from "./AdminTagsPanel";
import { formatPercent } from "@/shared/lib/format";
import Row, { type Entry } from "./SalaryEntryRow";

const MONTH = new Date().toLocaleDateString("ru-RU", { month: "long" });

export default function ProfileSalaryTab({
  user,
  salary,
  tags,
  setTags,
  setUser,
  averageGuildGS,
  isAdmin,
}: {
  user: ProfileUser;
  salary: number | null;
  tags: { id: number; tag: string }[];
  setTags: (tags: { id: number; tag: string }[]) => void;
  setUser: (user: ProfileUser) => void;
  averageGuildGS: number;
  isAdmin: boolean;
}) {
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const { data, reload } = useAsyncData(String(user.id), async () => {
    const [bonuses, penalties] = await Promise.all([
      getUserSalaryBonus(user.id),
      getUserPenaltyPoints(user.id),
    ]);
    return { bonuses, penalties };
  });
  const bonuses: Entry[] = data?.bonuses ?? [];
  const penalties: Entry[] = data?.penalties ?? [];

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
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2.5 sm:px-4.5">
          <div>
            <h2 className="text-base font-semibold">
              Из чего складывается зарплата
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Бонусы и штрафы применяются по очереди, см. «Основную информацию»,
              п. 3
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xl font-bold tabular-nums">
              <Image src={GOLD_ICON_URL} alt="" width={16} height={16} />
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
                ? `${penaltyPoints} — минус ${formatPercent(penaltyPercent, 1)} к зарплате`
                : "штрафов нет"
            }
            value={
              penaltyPoints > 0
                ? `−${formatPercent(Math.min(100, penaltyPercent), 1)}`
                : "0%"
            }
            positive={penaltyPoints > 0 ? false : null}
          />
        </ul>

        {isAdmin && (
          <div className="flex gap-2 border-t border-border/60 px-4 pt-3 pb-4 sm:px-4.5">
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
        <AdminTagsPanel
          user={user}
          tags={tags}
          setTags={setTags}
          setUser={setUser}
          averageGuildGS={averageGuildGS}
        />
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
