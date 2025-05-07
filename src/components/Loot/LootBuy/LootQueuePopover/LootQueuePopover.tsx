"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueueTableSimple } from "./QueueTableSimple";
import { QueueTableExtended } from "./QueueTableExtended";
import { AddToQueueForm } from "./AddToQueueForm";
import { EditToggleButton } from "./EditToggleButton";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { getLootQueueByItemName } from "@/src/actions/getLootQueueByItemName";
import { addToLootQueue } from "@/src/actions/addToLootQueue";

import { updateLootQueueEntry } from "@/src/actions/updateLootQueueEntry";
import type { LootQueueEntry } from "./LootQueueTypes";
import { markQueueLootAsSold } from "@/src/actions/markQueueLootAsSold";
import { useUserTag } from "@/src/hooks/useUserTag";

const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];

type LootQueuePopoverProps = {
  itemName: string;
  children: React.ReactNode;
};

export function LootQueuePopover({
  itemName,
  children,
}: LootQueuePopoverProps) {
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [queue, setQueue] = useState<Record<string, LootQueueEntry[]>>({});
  const isAdmin = useUserTag("Администратор");

  const [editMode, setEditMode] = useState(false);
  const isExtended = extendedItems.includes(itemName);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  const handleAddToQueue = async () => {
    if (!selectedUser) return;

    await addToLootQueue(selectedUser, itemName);
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue as LootQueueEntry[] });

    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = async (entry: LootQueueEntry) => {
    await markQueueLootAsSold({
      lootQueueId: entry.id,
      userId: entry.userId,
      itemName,
      delivered: entry.delivered,
    });
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue as LootQueueEntry[] });
  };

  const handleChange = async (index: number, field: string, value: any) => {
    const entry = queue[itemName]?.[index];
    if (!entry) return;

    const updated = {
      ...entry,
      [field]: value,
    };

    await updateLootQueueEntry(updated);
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue as LootQueueEntry[] });
  };

  useEffect(() => {
    const loadData = async () => {
      const [fetchedUsers, fetchedQueue] = await Promise.all([
        getActiveUsers(),
        getLootQueueByItemName(itemName),
      ]);

      setAllUsers(fetchedUsers.map((u: { username: string }) => u.username));
      setQueue({ [itemName]: fetchedQueue as LootQueueEntry[] });
    };

    loadData();
  }, [itemName]);

  const commonProps = {
    queue: queue[itemName] || [],
    editMode,
    handleChange,
    handleSold,
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
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-[620px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Очередь на: {itemName}</div>
            <EditToggleButton
              editMode={editMode}
              toggle={() => setEditMode((prev) => !prev)}
            />
          </div>
          <QueueTableSimple {...commonProps} />
          {editMode && <AddToQueueForm {...formProps} />}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[1200px] max-w-none">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Очередь на: {itemName}
            </DialogTitle>
            {isAdmin && (
              <EditToggleButton
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
