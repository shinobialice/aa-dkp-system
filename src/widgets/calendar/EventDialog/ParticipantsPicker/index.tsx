"use client";

import { useState } from "react";
import type { IdFlags, PickerUser } from "../eventFormModel";
import OcrBanner from "./OcrBanner";
import OcrScreenshotViewer from "./OcrScreenshotViewer";
import ParticipantGroups from "./ParticipantGroups";
import ParticipantsFilter from "./ParticipantsFilter";
import ParticipantsSummary from "./ParticipantsSummary";
import {
  countLate,
  countSelected,
  flagsForUsers,
  participantGroups,
  type ParticipantFilter,
} from "./participantsModel";
import { useOcrShots } from "./useOcrShots";

type Props = {
  users: PickerUser[];
  selectedIds: IdFlags;
  lateIds: IdFlags;
  onSelectionChange: (selectedIds: IdFlags) => void;
  onLateToggle: (userId: number) => void;
};

export default function ParticipantsPicker({
  users,
  selectedIds,
  lateIds,
  onSelectionChange,
  onLateToggle,
}: Props) {
  const [filter, setFilter] = useState<ParticipantFilter>("all");
  const [search, setSearch] = useState("");
  const ocr = useOcrShots();

  const selectedCount = countSelected(users, selectedIds);
  const idByName = new Map(users.map((user) => [user.username, user.id]));

  const isSelected = (username: string) => {
    const id = idByName.get(username);
    return id !== undefined && !!selectedIds[id];
  };

  const setSelected = (username: string, selected: boolean) => {
    const id = idByName.get(username);
    if (id === undefined) return;
    onSelectionChange({ ...selectedIds, [id]: selected });
  };

  const handleFiles = async (files: File[]) => {
    const matched = await ocr.recognize(files);
    if (!matched) return;
    const recognized = users.filter(
      (user) => !user.inactive && matched.has(user.username),
    );
    onSelectionChange(flagsForUsers(recognized));
  };

  const handleAssign = (
    shotIndex: number,
    wordIndex: number,
    username: string,
  ) => {
    ocr.assignWord(shotIndex, wordIndex, username);
    setSelected(username, true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">
      <ParticipantsSummary
        total={users.length}
        selectedCount={selectedCount}
        lateCount={countLate(users, selectedIds, lateIds)}
        ocrLoading={ocr.loading}
        onFilesPick={handleFiles}
        onSelectAll={() => onSelectionChange(flagsForUsers(users))}
        onClear={() => onSelectionChange({})}
      />
      <OcrBanner
        loading={ocr.loading}
        error={ocr.error}
        shots={ocr.shots}
        isSelected={isSelected}
        onReview={() => ocr.setViewerOpen(true)}
        onDismiss={ocr.clearShots}
      />
      <OcrScreenshotViewer
        open={ocr.viewerOpen}
        onOpenChange={ocr.setViewerOpen}
        shots={ocr.shots}
        userNames={users
          .filter((user) => !user.inactive)
          .map((user) => user.username)}
        isSelected={isSelected}
        onToggle={(username) => setSelected(username, !isSelected(username))}
        onAssign={handleAssign}
      />
      <ParticipantsFilter
        filter={filter}
        search={search}
        total={users.length}
        selectedCount={selectedCount}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />
      <ParticipantGroups
        groups={participantGroups(users, selectedIds, filter, search)}
        selectedIds={selectedIds}
        lateIds={lateIds}
        onToggle={(id) =>
          onSelectionChange({ ...selectedIds, [id]: !selectedIds[id] })
        }
        onLateToggle={onLateToggle}
      />
    </div>
  );
}
