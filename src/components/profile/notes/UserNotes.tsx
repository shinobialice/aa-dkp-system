"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { differenceInMonths } from "date-fns";
import { Trash2, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSalaryBonusDialog from "./AddSalaryBonusDialog";
import { deleteUserSalaryBonus } from "@/src/actions/addUserSalaryBonus";
import { getUserSalaryBonus } from "@/src/actions/getUserSalaryBonus";
import { UserTagsSection } from "./UserTagsSection";
import { getUserTags } from "@/src/actions/userTagsActions";

function UserBonusesSection({
  bonuses,
  onRemove,
}: {
  bonuses: any[];
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col divide-y">
      {bonuses.map((bonus) => (
        <div key={bonus.id} className="flex justify-between items-center py-4">
          <div className="text-sm font-medium">{bonus.reason}</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{bonus.amount}%</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={async () => {
                await deleteUserSalaryBonus(bonus.id);
                onRemove();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UserNotes({
  user,
  initialTags,
  updateTags,
  setUser, // ✅ добавляем сюда
}: {
  user: any;
  initialTags: { id: number; tag: string }[];
  updateTags: (tags: { id: number; tag: string }[]) => void;
  setUser: (user: any) => void; // ✅ добавляем тип
}) {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [tags, setTags] = useState(initialTags); // ← ЛОКАЛЬНОЕ состояние

  useEffect(() => {
    const fetchBonuses = async () => {
      const data = await getUserSalaryBonus(user.id);
      setBonuses(data);
    };
    fetchBonuses();
  }, [user.id, refreshToggle]);

  useEffect(() => {
    const fetchTags = async () => {
      const data = await getUserTags(user.id);
      setTags(data);
      updateTags(data); // ← ОБНОВЛЯЕМ РОДИТЕЛЯ
    };
    fetchTags();
  }, [user.id]);

  function calculateGuildBonus(joinedAt: string | null) {
    if (!joinedAt) return 0;
    const now = new Date();
    const joinedDate = new Date(joinedAt);
    const months = differenceInMonths(now, joinedDate);
    if (months < 6) return 0;
    const extraPeriods = Math.floor((months - 6) / 6);
    return 10 + extraPeriods * 5;
  }

  const guildBonus = calculateGuildBonus(user?.joined_at || null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex">Заметки</CardTitle>
      </CardHeader>
      <CardContent className="border-t">
        <div className="flex gap-8 mt-6">
          <div className="flex-1 border-r pr-6">
            <div className="flex justify-between">
              <div className="text-xl font-bold mb-4">Бонусы к ЗП</div>
              <Button
                onClick={() => setBonusDialogOpen(true)}
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                size="icon"
              >
                <CirclePlus />
              </Button>
            </div>

            <UserBonusesSection
              bonuses={bonuses}
              onRemove={() => setRefreshToggle(!refreshToggle)}
            />

            <div className="flex justify-between items-center py-4">
              <div className="text-sm font-medium">Бонус за стаж в гильдии</div>
              <div className="text-lg font-semibold">{guildBonus}%</div>
            </div>
          </div>

          <div className="flex-1 pl-6">
            <div className="text-xl font-bold mb-4">Тэги</div>
            <UserTagsSection
              user={user}
              onUpdate={() => {}}
              tags={tags}
              setTags={(newTags) => {
                setTags(newTags);
                updateTags(newTags);
              }}
              setUser={setUser} // ✅ это уже правильно
            />
          </div>
        </div>
      </CardContent>

      <AddSalaryBonusDialog
        open={bonusDialogOpen}
        onClose={() => setBonusDialogOpen(false)}
        userId={user.id}
        onAdded={() => setRefreshToggle(!refreshToggle)}
      />
    </Card>
  );
}
