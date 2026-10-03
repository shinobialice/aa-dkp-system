"use client";

import { useState } from "react";
import { getAttendanceBonusTypesForRaid } from "@/actions/attendanceBonusSettings";
import createRaidEvent from "@/actions/createRaidEvent";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getBosses, type Boss } from "@/actions/getBosses";
import type { RaidDetails } from "@/actions/getRaidById";
import { getUnlinkedLootCandidates } from "@/actions/getUnlinkedLootCandidates";
import { linkLootToRaid } from "@/actions/linkLootToRaid";
import updateEvent from "@/actions/updateEvent";
import { useAsyncData } from "@/hooks/useAsyncData";
import { isPrimeLinkableSource } from "@/widgets/Loot/GuildLoot/LootTypes";
import {
  activeBonusIds,
  checkedIds,
  hasErrors,
  initialDraft,
  NO_ERRORS,
  pickerUsers,
  raidDkp,
  validateDraft,
  type EventDraft,
  type EventFormErrors,
  type EventFormMode,
  type IdFlags,
} from "./eventFormModel";

export type FlagField =
  | "bonusIds"
  | "participantIds"
  | "lateIds"
  | "lootLinkIds";

export type EventForm = ReturnType<typeof useEventForm>;

export function useEventForm(mode: EventFormMode, event: RaidDetails | null) {
  const [draft, setDraft] = useState(() => initialDraft(event));
  const [errors, setErrors] = useState(NO_ERRORS);
  const [submitting, setSubmitting] = useState(false);

  const dateKey = draft.date?.toISOString() ?? "none";
  const atDate = draft.date ?? undefined;
  const selectedBoss = draft.bosses[0]?.boss_name ?? null;
  const canLinkLoot =
    !!selectedBoss && !!draft.date && isPrimeLinkableSource(selectedBoss);

  const bossList = useAsyncData(`bosses:${dateKey}`, () => getBosses(atDate));
  const bonusList = useAsyncData(`bonuses:${dateKey}`, () =>
    getAttendanceBonusTypesForRaid(atDate).catch(() => []),
  );
  const userList = useAsyncData("active-users", getActiveUsers);
  const lootList = useAsyncData(
    canLinkLoot ? `loot:${selectedBoss}:${dateKey}` : null,
    () =>
      getUnlinkedLootCandidates({
        bossName: selectedBoss ?? "",
        date: draft.date?.toISOString() ?? "",
      }),
  );

  const bosses = bossList.data ?? [];
  const bonuses = bonusList.data;
  const users = pickerUsers(userList.data ?? [], event);
  const selectedUsers = users.filter((user) => draft.participantIds[user.id]);
  const bonusIds = activeBonusIds(draft.bonusIds, bonuses, draft.bosses);
  const dkp = raidDkp(draft.bosses, bosses, bonuses, bonusIds);

  const updateDraft = (patch: Partial<EventDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const clearError = (field: keyof EventFormErrors) => {
    setErrors((current) => ({ ...current, [field]: false }));
  };

  const selectCategory = (category: string) => {
    if (category === draft.category) return;
    updateDraft({ category, bosses: [], bonusIds: {} });
    clearError("category");
  };

  const selectBoss = (boss: Boss) => {
    updateDraft({ bosses: [boss] });
    clearError("selectedBoss");
  };

  const changeDate = (date: Date | null) => {
    updateDraft({ date });
    setErrors((current) => ({
      ...current,
      selectedDate: mode === "create" && !date,
    }));
  };

  const toggleFlag = (field: FlagField, id: number) => {
    setDraft((current) => ({
      ...current,
      [field]: { ...current[field], [id]: !current[field][id] },
    }));
  };

  const setParticipants = (participantIds: IdFlags) => {
    updateDraft({ participantIds });
  };

  const saveRaid = async (category: string, date: Date) => {
    const userIds = selectedUsers.map((user) => user.id);
    const args = [
      category,
      dkp,
      date,
      userIds,
      draft.bosses.map((boss) => boss.id),
      bonusIds,
      userIds.filter((id) => draft.lateIds[id]),
    ] as const;

    if (mode === "edit" && event) {
      await updateEvent(event.id, ...args);
      return event.id;
    }
    const raid = await createRaidEvent(...args);
    return raid.id;
  };

  const submit = async () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors) || !draft.category || !draft.date) return false;

    setSubmitting(true);
    try {
      const raidId = await saveRaid(draft.category, draft.date);
      await linkLootToRaid(checkedIds(draft.lootLinkIds), raidId);
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    event,
    draft,
    errors,
    submitting,
    bosses,
    bonuses,
    users,
    selectedUsers,
    selectedBoss,
    canLinkLoot,
    unlinkedLoot: canLinkLoot ? (lootList.data ?? []) : [],
    activeBonusIds: bonusIds,
    dkp,
    selectCategory,
    selectBoss,
    changeDate,
    toggleFlag,
    setParticipants,
    submit,
  };
}
