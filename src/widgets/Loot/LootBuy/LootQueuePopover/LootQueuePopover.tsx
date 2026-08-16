"use client";

import { useState } from "react";
import { Dices } from "lucide-react";
import { AddToQueueForm } from "./AddToQueueForm";
import { EditToggleButton } from "./EditToggleButton";
import type { LootQueueEntry } from "./LootQueueTypes";
import { QueueTableExtended } from "./QueueTableExtended";
import { QueueTableSimple } from "./QueueTableSimple";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { addToLootQueue } from "@/actions/addToLootQueue";
import { getLootQueueByItemName } from "@/actions/getLootQueueByItemName";
import { markQueueLootAsSold } from "@/actions/markQueueLootAsSold";
import { removeFromLootQueue } from "@/actions/removeFromLootQueue";
import { reorderLootQueue } from "@/actions/reorderLootQueue";
import { updateLootQueueEntry } from "@/actions/updateLootQueueEntry";

const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];
const rollItems = ["Аметистовая гравировка северной звезды"];

type Props = {
  itemName: string;
  children: React.ReactNode;
  isAdmin: boolean;
  allUsers: string[];
};

type EditableField = "required" | "delivered" | "status" | "synth_target";

export function LootQueuePopover({
  itemName,
  children,
  isAdmin,
  allUsers,
}: Props) {
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [queue, setQueue] = useState<LootQueueEntry[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const isExtended = extendedItems.includes(itemName);
  const showRoll = rollItems.includes(itemName);

  const refreshQueue = async () => {
    const updatedQueue = (await getLootQueueByItemName(
      itemName,
    )) as LootQueueEntry[];
    setQueue(
      showRoll
        ? [...updatedQueue].sort((a, b) => (b.roll ?? -1) - (a.roll ?? -1))
        : updatedQueue,
    );
  };

  const handleAddToQueue = async () => {
    if (!selectedUser) {
      return;
    }
    await addToLootQueue(selectedUser, itemName);
    await refreshQueue();
    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = async (entry: LootQueueEntry) => {
    await markQueueLootAsSold(entry.id);
    await refreshQueue();
  };

  const handleRemove = async (entry: LootQueueEntry) => {
    await removeFromLootQueue(entry.id);
    await refreshQueue();
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const reordered = [...queue];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setQueue(reordered);
    await reorderLootQueue(reordered.map((entry) => entry.id));
  };

  const handleRollChange = async (
    entry: LootQueueEntry,
    roll: number | null,
  ) => {
    await updateLootQueueEntry({ id: entry.id, roll });
    await refreshQueue();
  };

  const handleRollAll = async () => {
    await Promise.all(
      queue.map((entry) =>
        updateLootQueueEntry({
          id: entry.id,
          roll: Math.floor(Math.random() * 101),
        }),
      ),
    );
    await refreshQueue();
  };

  const handleStatusToggle = async (
    entry: LootQueueEntry,
    status: "пропуск" | "позже",
  ) => {
    await updateLootQueueEntry({
      id: entry.id,
      status: entry.status === status ? "" : status,
    });
    await refreshQueue();
  };

  const handleChange = async (
    index: number,
    field: EditableField,
    value: string | number,
  ): Promise<void> => {
    const entry = queue[index];
    if (!entry) {
      return;
    }

    let castedValue: string | number = value;

    if (
      (field === "required" || field === "delivered") &&
      typeof value === "string"
    ) {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        return;
      }
      castedValue = parsed;
    }

    const updated = {
      ...entry,
      [field]: castedValue,
    };

    await updateLootQueueEntry(updated);
    await refreshQueue();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) refreshQueue();
  };

  const commonProps = {
    queue,
    editMode,
    handleChange,
    handleSold,
    handleRemove,
    handleReorder,
  };

  const formProps = {
    allUsers,
    searchUser,
    setSearchUser,
    selectedUser,
    setSelectedUser,
    onAdd: handleAddToQueue,
  };

  if (!isExtended) {
    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-[620px] max-h-[min(1000px,var(--radix-popover-content-available-height))] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="text-sm font-semibold">Очередь на: {itemName}</div>
            <div className="flex items-center gap-2">
              {showRoll && isAdmin && editMode && queue.length > 0 && (
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={handleRollAll}
                >
                  <Dices className="h-3 w-3 mr-1" /> Ролл
                </Button>
              )}
              <EditToggleButton
                isAdmin={isAdmin}
                editMode={editMode}
                toggle={() => setEditMode((prev) => !prev)}
              />
            </div>
          </div>
          <div className="overflow-y-auto min-h-0">
            <QueueTableSimple
              {...commonProps}
              showRoll={showRoll}
              handleRollChange={handleRollChange}
              handleStatusToggle={handleStatusToggle}
            />
          </div>
          {editMode && (
            <div className="shrink-0 pt-2">
              <AddToQueueForm {...formProps} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[1200px] max-w-none">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Очередь на: {itemName}
            </DialogTitle>
            {isAdmin && (
              <EditToggleButton
                isAdmin={isAdmin}
                classname="mr-4"
                editMode={editMode}
                toggle={() => setEditMode((prev) => !prev)}
              />
            )}
          </div>
        </DialogHeader>

        <QueueTableExtended {...commonProps} />
        {editMode && <AddToQueueForm {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}
