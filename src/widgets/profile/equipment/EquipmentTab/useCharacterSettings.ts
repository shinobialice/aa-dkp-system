import { useState } from "react";
import { toast } from "sonner";
import type { ProfileUser } from "@/actions/getUser";
import saveCharacterBuffs from "@/actions/saveCharacterBuffs";
import saveCharacterLevel from "@/actions/saveCharacterLevel";
import type { RoleSlot } from "@/shared/config/roleSlots";
import { errorMessage } from "@/shared/lib/errorMessage";
import type { SelectedBuffs } from "../characterBuffs";

export function useCharacterSettings(
  userId: number,
  roleSlot: RoleSlot,
  user: ProfileUser,
  onBuffsChange: (buffs: SelectedBuffs) => void,
) {
  const [level, setLevel] = useState(user.character_level);

  const changeLevel = async (next: number) => {
    const previous = level;
    setLevel(next);
    try {
      await saveCharacterLevel(userId, next);
    } catch (error) {
      setLevel(previous);
      toast.error(
        errorMessage(error, "Не удалось сохранить уровень персонажа"),
      );
    }
  };

  const saveBuffs = async (buffs: SelectedBuffs) => {
    await saveCharacterBuffs(userId, roleSlot, buffs);
    onBuffsChange(buffs);
    toast.success("Баффы сохранены");
  };

  return { level, changeLevel, saveBuffs };
}
