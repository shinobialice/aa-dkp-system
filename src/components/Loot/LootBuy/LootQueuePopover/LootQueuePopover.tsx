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
import { markLootAsSold } from "@/src/actions/markLootAsSold";
import { updateLootQueueEntry } from "@/src/actions/updateLootQueueEntry";
import type { LootQueueEntry } from "./LootQueueTypes";

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

  const [editMode, setEditMode] = useState(false);
  const isExtended = extendedItems.includes(itemName);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  const handleAddToQueue = async () => {
    if (!selectedUser) return;

    await addToLootQueue(selectedUser, itemName);
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue });

    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = async (entry: LootQueueEntry) => {
    console.log("handleSold", entry);
    await markLootAsSold({
      lootQueueId: entry.id,
      userId: entry.userId,
      itemName,
      delivered: entry.delivered,
    });
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue });
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
    setQueue({ [itemName]: updatedQueue });
  };

  useEffect(() => {
    const loadData = async () => {
      const [fetchedUsers, fetchedQueue] = await Promise.all([
        getActiveUsers(),
        getLootQueueByItemName(itemName),
      ]);

      setAllUsers(fetchedUsers.map((u: { username: string }) => u.username));
      setQueue({ [itemName]: fetchedQueue });
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
      <DialogContent className="w-[1200px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Очередь на: {itemName}
            </DialogTitle>
            <EditToggleButton
              classname="mr-4"
              editMode={editMode}
              toggle={() => setEditMode((prev) => !prev)}
            />
          </div>
        </DialogHeader>

        <QueueTableExtended {...commonProps} />
        {editMode && <AddToQueueForm {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}
