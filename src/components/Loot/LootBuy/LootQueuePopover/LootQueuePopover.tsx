"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { addToLootQueue } from "@/src/actions/addToLootQueue";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { getLootQueueByItemName } from "@/src/actions/getLootQueueByItemName";
import { markQueueLootAsSold } from "@/src/actions/markQueueLootAsSold";
import { updateLootQueueEntry } from "@/src/actions/updateLootQueueEntry";
import { useUserTag } from "@/src/hooks/useUserTag";

const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];

type LootQueuePopoverProps = {
  itemName: string;
  children: React.ReactNode;
};

type EditableField = "required" | "delivered" | "status" | "synth_target";

export function LootQueuePopover({
  itemName,
  children,
}: LootQueuePopoverProps) {
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [queue, setQueue] = useState<Record<string, LootQueueEntry[]>>({});
  const [editMode, setEditMode] = useState(false);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const isAdmin = useUserTag("Администратор");
  const isExtended = extendedItems.includes(itemName);

  const handleAddToQueue = async () => {
    if (!selectedUser) {return;}
    await addToLootQueue(selectedUser, itemName);
    const updatedQueue = await getLootQueueByItemName(itemName);
    setQueue({ [itemName]: updatedQueue });
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
    setQueue({ [itemName]: updatedQueue });
  };

  const handleChange = async (
    index: number,
    field: EditableField,
    value: string | number
  ): Promise<void> => {
    const entry = queue[itemName]?.[index];
    if (!entry) {return;}

    let castedValue: string | number = value;

    if (
      (field === "required" || field === "delivered") &&
      typeof value === "string"
    ) {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {return;}
      castedValue = parsed;
    }

    const updated = {
      ...entry,
      [field]: castedValue,
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
