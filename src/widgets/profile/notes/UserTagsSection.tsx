"use client";
import type { ProfileUser } from "@/actions/getUser";

import { useEffect, useState } from "react";
import { Trash2, CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
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
import { badgeColors, allPossibleTags } from "./tagStyles";
import FlagRow from "./FlagRow";

export function UserTagsSection({
  user,
  tags,
  setTags,
  setUser,
  averageGuildGS,
  isAdmin,
}: {
  user: ProfileUser;
  setUser: (user: ProfileUser) => void;
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

  async function updateFlag(
    field: "active" | "is_eligible_for_salary" | "probation_bypass",
    value: boolean,
  ) {
    setUpdating(true);
    try {
      await updateUser(user.id, { [field]: value });
      setUser({ ...user, [field]: value });
    } catch {
      toast.error("Не удалось сохранить");
    } finally {
      setUpdating(false);
    }
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

    await updateFlag("is_eligible_for_salary", newValue);
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
    const prevTags = tags;
    setTags([...tags, { id: -(tags.length + 1), tag }]);
    try {
      const newTag = await addUserTag(user.id, tag);
      setTags([...prevTags, newTag]);
    } catch {
      setTags(prevTags);
      toast.error("Не удалось добавить тэг");
    }
  }

  const availableTags = allPossibleTags.filter(
    (tag) => !tags.some((t) => t.tag === tag),
  );

  return (
    <div className="flex flex-col divide-y">
      <FlagRow
        label="Активен"
        checked={user.active}
        editable={isAdmin}
        disabled={updating}
        onChange={(value) => updateFlag("active", value)}
      />
      <FlagRow
        label="Получает зарплату"
        checked={user.is_eligible_for_salary}
        editable={isAdmin}
        disabled={updating}
        onChange={toggleSalary}
      />
      <FlagRow
        label="Испыталка не учитывается"
        checked={user.probation_bypass}
        editable={isAdmin}
        disabled={updating}
        onChange={(value) => updateFlag("probation_bypass", value)}
      />

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
                await updateFlag("is_eligible_for_salary", true);
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
