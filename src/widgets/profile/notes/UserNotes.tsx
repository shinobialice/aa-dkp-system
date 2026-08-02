"use client";

import { useEffect, useState } from "react";
import { Trash2, CirclePlus } from "lucide-react";
import calculateGuildTenureBonus from "@/utils/calculateGuildTenureBonus";
import AddSalaryBonusDialog from "./AddSalaryBonusDialog";
import AddPenaltyPointsDialog from "./AddPenaltyPointsDialog";
import { UserTagsSection } from "./UserTagsSection";
import { Button } from "@/shared/ui";
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/ui";
import { deleteUserSalaryBonus } from "@/actions/addUserSalaryBonus";
import { getUserSalaryBonus } from "@/actions/getUserSalaryBonus";
import { getUserTags } from "@/actions/userTagsActions";
import {
  getUserPenaltyPoints,
  deleteUserPenaltyPoints,
} from "@/actions/penaltyActions";

function UserBonusesSection({
  bonuses,
  onRemove,
  isAdmin,
}: {
  bonuses: any[];
  onRemove: () => void;
  isAdmin: boolean;
}) {
  return (
    <div className="flex flex-col divide-y">
      {bonuses.map((bonus) => (
        <div key={bonus.id} className="flex justify-between items-center py-4">
          <div className="text-sm font-medium">{bonus.reason}</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{bonus.amount}%</div>
            {isAdmin && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserPenaltiesSection({
  penalties,
  onRemove,
}: {
  penalties: any[];
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col divide-y">
      {penalties.map((penalty) => (
        <div key={penalty.id} className="flex justify-between items-center py-4">
          <div className="text-sm font-medium">{penalty.reason}</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{penalty.amount}</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={async () => {
                await deleteUserPenaltyPoints(penalty.id);
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
  const [penalties, setPenalties] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [tags, setTags] = useState(initialTags);

  useEffect(() => {
    const fetchBonuses = async () => {
      const data = await getUserSalaryBonus(user.id);
      setBonuses(data);
    };
    fetchBonuses();
  }, [user.id, refreshToggle]);

  useEffect(() => {
    const fetchPenalties = async () => {
      const data = await getUserPenaltyPoints(user.id);
      setPenalties(data);
    };
    fetchPenalties();
  }, [user.id, refreshToggle]);

  useEffect(() => {
    const fetchTags = async () => {
      const data = await getUserTags(user.id);
      setTags(data);
      updateTags(data);
    };
    fetchTags();
  }, [user.id]);

  const guildBonus = calculateGuildTenureBonus(user?.joined_at || null);

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
              isAdmin={isAdmin}
            />

            <div className="flex justify-between items-center py-4">
              <div className="text-sm font-medium">Бонус за стаж в гильдии</div>
              <div className="text-lg font-semibold">
                {Math.round(guildBonus)}%
              </div>
            </div>
          </div>

          <div className={`flex-1 ${isAdmin ? "border-r px-6" : "pl-6"}`}>
            <div className="flex justify-between">
              <div className="text-xl font-bold mb-4">Штрафы</div>
              {isAdmin && (
                <Button
                  onClick={() => setPenaltyDialogOpen(true)}
                  variant="ghost"
                  className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                  size="icon"
                >
                  <CirclePlus />
                </Button>
              )}
            </div>

            <UserPenaltiesSection
              penalties={penalties}
              onRemove={() => setRefreshToggle(!refreshToggle)}
            />
          </div>

          {isAdmin && (
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
                isAdmin={isAdmin}
              />
            </div>
          )}
        </div>
      </CardContent>

      <AddSalaryBonusDialog
        open={bonusDialogOpen}
        onClose={() => setBonusDialogOpen(false)}
        userId={user.id}
        onAdded={() => setRefreshToggle(!refreshToggle)}
      />

      <AddPenaltyPointsDialog
        open={penaltyDialogOpen}
        onClose={() => setPenaltyDialogOpen(false)}
        userId={user.id}
        onAdded={() => setRefreshToggle(!refreshToggle)}
      />
    </Card>
  );
}
