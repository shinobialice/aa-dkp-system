"use client";

import { useEffect, useState } from "react";
import { Trash2, CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Switch } from "@/shared/ui";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui";
import { updateUser } from "@/actions/updateUser";
import { deleteUserTag, addUserTag } from "@/actions/userTagsActions";
import { getSalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import getSalaryEligibilityErrors from "@/utils/getSalaryEligibilityErrors";

type UserType = {
  id: number;
  active: boolean;
  is_eligible_for_salary: boolean;
  joined_at: string | Date;
};

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
  АФК: "rgb(120, 120, 120)",
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
  "АФК",
];

export function UserTagsSection({
  user,
  onUpdate,
  tags,
  setTags,
  setUser,
  averageGuildGS,
  isAdmin,
}: {
  user: UserType;
  setUser: (user: UserType) => void;
  onUpdate: () => void;
  tags: { id: number; tag: string }[];
  setTags: (tags: { id: number; tag: string }[]) => void;
  averageGuildGS: number;
  isAdmin: boolean;
}) {
  const [updating, setUpdating] = useState(false);
  const [gsEnabled, setGsEnabled] = useState(false);
  const [gsWarning, setGsWarning] = useState<string | null>(null);

  useEffect(() => {
    getSalaryEligibilitySettings().then((s) => setGsEnabled(s.gsEnabled));
  }, []);

  async function toggleActive(newValue: boolean) {
    setUpdating(true);
    await updateUser(user.id, { active: newValue });
    setUser({ ...user, active: newValue });
    setUpdating(false);
    onUpdate();
  }

  async function applySalaryToggle(newValue: boolean) {
    setUpdating(true);
    await updateUser(user.id, { is_eligible_for_salary: newValue });
    setUser({ ...user, is_eligible_for_salary: newValue });
    setUpdating(false);
    onUpdate();
  }

  async function toggleSalary(newValue: boolean) {
    if (newValue) {
      const { hardErrors, gsWarning } = getSalaryEligibilityErrors(
        user,
        averageGuildGS,
        tags,
        gsEnabled,
      );
      if (hardErrors.length > 0) {
        toast.error("Нельзя выдать зарплату", {
          description: (
            <ul className="list-disc list-inside space-y-1">
              {hardErrors.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          ),
        });
        return;
      }
      if (gsWarning) {
        setGsWarning(gsWarning);
        return;
      }
    }

    await applySalaryToggle(newValue);
  }

  async function handleDeleteTag(tagId: number) {
    await deleteUserTag(tagId);
    setTags(tags.filter((t) => t.id !== tagId));
  }

  async function handleAddTag(tag: string) {
    const exists = tags.some((t) => t.tag === tag);
    if (exists) {
      return;
    }
    const newTag = await addUserTag(user.id, tag);
    setTags([...tags, newTag]);
  }

  const availableTags = allPossibleTags.filter(
    (tag) => !tags.some((t) => t.tag === tag),
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
        {/* {isAdmin && ( */}
        <Switch
          className="cursor-pointer"
          checked={user.active}
          onCheckedChange={toggleActive}
          disabled={updating}
        />
        {/* )} */}
      </div>
      <div className="flex justify-between items-center py-4">
        <Badge
          className="text-background"
          style={{ backgroundColor: badgeColors["Получает зарплату"] }}
        >
          Получает зарплату
        </Badge>
        {/* {isAdmin && ( */}
        <Switch
          checked={user.is_eligible_for_salary}
          onCheckedChange={toggleSalary}
          disabled={updating}
          className="cursor-pointer"
        />
        {/* )} */}
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
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteTag(tag.id)}
              className="text-muted-foreground cursor-pointer"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ))}
      {isAdmin && (
        <div>
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
      )}

      <AlertDialog
        open={gsWarning !== null}
        onOpenChange={(open) => !open && setGsWarning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ты уверен?</AlertDialogTitle>
            <AlertDialogDescription>{gsWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setGsWarning(null);
                await applySalaryToggle(true);
              }}
            >
              Всё равно выдать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
