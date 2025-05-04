"use client";

import { useState } from "react";
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

const allUsers = ["Vladzor", "Mazik", "Shaiya", "Verta", "Rrrr"];
const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];

const mockQueue = {
  "Эссенция ярости": [
    {
      username: "Dimonishx",
      status: "позже",
      synthTarget: "...",
      required: 1000000,
      delivered: 185268,
    },
    {
      username: "Бобр",
      status: "продано",
      synthTarget: "Сет Анталона",
      delivered: 700000,
    },
    {
      username: "Felanza",
      status: "пропуск",
      synthTarget: "Булава с Ксанатоса и Щит с Ксанатоса",
      delivered: 407296,
    },
  ],
};

export function LootQueuePopover({ itemName, children }) {
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [queue, setQueue] = useState(mockQueue);
  const [editMode, setEditMode] = useState(false);
  const isExtended = extendedItems.includes(itemName);

  const handleAddToQueue = () => {
    if (!selectedUser) return;
    const now = new Date();
    const newEntry = {
      username: selectedUser,
      createdAt: now,
      ...(isExtended
        ? { status: "позже", synthTarget: "", delivered: 0, required: 0 }
        : {}),
    };
    setQueue((prev) => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), newEntry],
    }));
    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = (username, totalDelivered) => {
    setQueue((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || []).filter((u) => u.username !== username),
    }));
    console.log(
      `Добавлен в инвентарь: ${username} => ${itemName}, всего отдано: ${totalDelivered}`
    );
  };

  const handleChange = (index, field, value) => {
    setQueue((prev) => {
      const newQueue = [...(prev[itemName] || [])];
      newQueue[index] = { ...newQueue[index], [field]: value };
      return { ...prev, [itemName]: newQueue };
    });
  };

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
