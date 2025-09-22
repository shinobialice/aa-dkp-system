"use client";

import { useEffect, useState } from "react";
import { differenceInMonths } from "date-fns";
import { Trash2, CirclePlus } from "lucide-react";
import AddSalaryBonusDialog from "./AddSalaryBonusDialog";
import { UserTagsSection } from "./UserTagsSection";
import { Button } from "@/shared/ui";
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/ui";
import { deleteUserSalaryBonus } from "@/actions/addUserSalaryBonus";
import { getUserSalaryBonus } from "@/actions/getUserSalaryBonus";
import { getUserTags } from "@/actions/userTagsActions";

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
  setUser,
  averageGuildGS,
  isAdmin,
}: {
  user: any;
  initialTags: { id: number; tag: string }[];
  updateTags: (tags: { id: number; tag: string }[]) => void;
  setUser: (user: any) => void;
  averageGuildGS: number;
  isAdmin: boolean;
}) {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [tags, setTags] = useState(initialTags);

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
      updateTags(data);
    };
    fetchTags();
  }, [user.id]);

  function calculateGuildBonus(joinedAt: string | null) {
    if (!joinedAt) {
      return 0;
    }
    const now = new Date();
    const joinedDate = new Date(joinedAt);
    const months = differenceInMonths(now, joinedDate);
    if (months < 6) {
      return 0;
    }
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
              {isAdmin && (
                <Button
                  onClick={() => setBonusDialogOpen(true)}
                  variant="ghost"
                  className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                  size="icon"
                >
                  <CirclePlus />
                </Button>
              )}
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
              setUser={setUser}
              averageGuildGS={averageGuildGS}
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
