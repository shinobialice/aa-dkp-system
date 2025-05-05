"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { differenceInMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSalaryBonusDialog from "./AddSalaryBonusDialog";
import { deleteUserSalaryBonus } from "@/src/actions/addUserSalaryBonus";
import { getUserSalaryBonus } from "@/src/actions/getUserSalaryBonus";

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

export default function UserNotes({ user }: { user: any }) {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBonuses = async () => {
      const data = await getUserSalaryBonus(user.id);
      setBonuses(data);
    };
    fetchBonuses();
  }, [user.id, refreshToggle]);

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

  const badgeColors: { [key: string]: string } = {
    Активен: "rgb(47, 158, 98)",
    "Получает зарплату": "rgb(23, 133, 115)",
    Администратор: "rgb(215, 100, 168)",
    Сноровка: "rgb(90, 54, 165)",
    Крит: "rgb(215, 100, 168)",
    ДВ: "rgb(232, 157, 53)",
    "World Boss": "rgb(201, 52, 52)",
    "Arch Boss": "rgb(47, 158, 98)",
    Двурук: "rgb(0, 148, 168)",
    Каст: "rgb(157, 41, 41)",
    Деф: "rgb(40, 111, 180)",
    "Guild Contract": "rgb(138, 81, 184)",
    Модератор: "rgb(58, 76, 92)",
  };

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
            <div className="flex justify-between">
              <div className="text-xl font-bold mb-4">Тэги</div>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                size="icon"
              >
                <CirclePlus />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </div>
            <div className="flex flex-col divide-y">
              {user.active && (
                <div className="flex justify-between items-center py-4">
                  <Badge
                    className="text-background"
                    style={{ backgroundColor: badgeColors["Активен"] }}
                  >
                    Активен
                  </Badge>
                  <Switch />
                </div>
              )}
              {user.is_eligible_for_salary && (
                <div className="flex justify-between items-center py-4">
                  <Badge
                    className="text-background"
                    style={{
                      backgroundColor: badgeColors["Получает зарплату"],
                    }}
                  >
                    Получает зарплату
                  </Badge>
                  <Switch disabled />
                </div>
              )}
              {user.tags?.map((tag: { id: number; tag: string }) => (
                <div
                  key={tag.id}
                  className="flex justify-between items-center py-4"
                >
                  <Badge
                    className="text-background"
                    style={{
                      backgroundColor:
                        badgeColors[tag.tag] || "rgb(59, 130, 246)",
                    }}
                  >
                    {tag.tag}
                  </Badge>
                  <Button
                    variant="ghost"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted cursor-pointer"
                    size="icon"
                  >
                    <Trash2 />
                    <span className="sr-only">Открыть меню</span>
                  </Button>
                </div>
              ))}
            </div>
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
