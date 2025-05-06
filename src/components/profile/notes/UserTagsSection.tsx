"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/src/actions/updateUser";
import {
  deleteUserTag,
  getUserTags,
  addUserTag,
} from "@/src/actions/userTagsActions";

const badgeColors: Record<string, string> = {
  Активен: "rgb(47, 158, 98)",
  "Получает зарплату": "rgb(23, 133, 115)",
  Администратор: "rgb(215, 100, 168)",
  Модератор: "rgb(58, 76, 92)",
  Сноровка: "rgb(90, 54, 165)",
  Крит: "rgb(215, 100, 168)",
  ДВ: "rgb(232, 157, 53)",
  Двурук: "rgb(0, 148, 168)",
  Каст: "rgb(157, 41, 41)",
  Деф: "rgb(40, 111, 180)",
};

const allPossibleTags = [
  "Администратор",
  "Модератор",
  "Сноровка",
  "Крит",
  "ДВ",
  "Двурук",
  "Каст",
  "Деф",
];

function canReceiveSalary(user: any): boolean {
  if (!user.joined_at || !user.class || !user.class_gear_score) return false;

  const now = new Date();
  const joined = new Date(user.joined_at);
  const day = joined.getDate();
  const monthsPassed =
    now.getFullYear() * 12 +
    now.getMonth() -
    (joined.getFullYear() * 12 + joined.getMonth());

  const probationOver =
    (day <= 20 && monthsPassed >= 1) || (day > 20 && monthsPassed >= 2);
  const passesGearScore = true;

  return probationOver && passesGearScore;
}

export function UserTagsSection({
  user,
  onUpdate,
  tags,
  setTags,
  setUser,
}: {
  user: any;
  onUpdate: () => void;
  tags: { id: number; tag: string }[];
  setTags: (tags: { id: number; tag: string }[]) => void;
  setUser: (user: any) => void; // ✅
}) {
  const [updating, setUpdating] = useState(false);

  async function toggleActive(newValue: boolean) {
    setUpdating(true);
    await updateUser(user.id, { active: newValue });
    setUser({ ...user, active: newValue }); // ✅ обновляем родительский user
    setUpdating(false);
    onUpdate();
  }

  async function toggleSalary(newValue: boolean) {
    if (newValue && !canReceiveSalary(user)) {
      toast.warning("Не выполнены условия для получения зарплаты");
      return;
    }
    setUpdating(true);
    await updateUser(user.id, { is_eligible_for_salary: newValue });
    setUser({ ...user, is_eligible_for_salary: newValue }); // ✅ обновляем родительский user
    setUpdating(false);
    onUpdate();
  }

  async function handleDeleteTag(tagId: number) {
    await deleteUserTag(tagId);
    setTags(tags.filter((t) => t.id !== tagId));
  }

  async function handleAddTag(tag: string) {
    const exists = tags.some((t) => t.tag === tag);
    if (exists) return;
    const newTag = await addUserTag(user.id, tag);
    setTags([...tags, newTag]);
  }

  const availableTags = allPossibleTags.filter(
    (tag) => !tags.some((t) => t.tag === tag)
  );

  return (
    <div className="flex flex-col divide-y">
      <div className="flex justify-between items-center py-4">
        <Badge
          className="text-background"
          style={{ backgroundColor: badgeColors["Активен"] }}
        >
          Активен
        </Badge>
        <Switch
          className="cursor-pointer"
          checked={user.active}
          onCheckedChange={toggleActive}
          disabled={updating}
        />
      </div>
      <div className="flex justify-between items-center py-4">
        <Badge
          className="text-background"
          style={{ backgroundColor: badgeColors["Получает зарплату"] }}
        >
          Получает зарплату
        </Badge>
        <Switch
          checked={user.is_eligible_for_salary}
          onCheckedChange={toggleSalary}
          disabled={updating}
          className="cursor-pointer"
        />
      </div>

      {tags.map((tag) => (
        <div key={tag.id} className="flex justify-between items-center py-2">
          <Badge
            className="text-background"
            style={{
              backgroundColor: badgeColors[tag.tag] || "rgb(59, 130, 246)",
            }}
          >
            {tag.tag}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTag(tag.id)}
            className="text-muted-foreground cursor-pointer"
          >
            <Trash2 />
          </Button>
        </div>
      ))}

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              onClick={() => handleAddTag(tag)}
              className="text-sm cursor-pointer"
            >
              <CirclePlus className="w-4 h-4 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
