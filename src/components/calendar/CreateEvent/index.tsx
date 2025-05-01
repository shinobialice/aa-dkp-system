import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScreenshotOcr } from "./components/ScreenshotOcr";
import { RaidDetailsForm } from "./components/RaidDetailsForm";
import { SelectRaidList } from "./components/SelectRaidList";
import { SelectedRaidList } from "./components/SelectedRaidList";
import { Separator } from "@/components/ui/separator";

export function CreateEvent() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<number, boolean>
  >({});
  const [users, setUsers] = React.useState<any[]>([]);

  const activeUsers = React.useMemo(
    () => users.filter((u) => u.active),
    [users]
  );
  const selectedUsers = React.useMemo(
    () => activeUsers.filter((_, index) => rowSelection[index]),
    [activeUsers, rowSelection]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить Активность</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Новая активность</DialogTitle>
          <DialogDescription>
            Создать новую активность гильдии
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:border-r md:pr-4">
            <RaidDetailsForm users={users} setUsers={setUsers} />
          </div>
          <div className="md:border-r md:pr-4">
            <ScreenshotOcr users={users} setRowSelection={setRowSelection} />
          </div>
          <div className="md:border-r md:pr-4">
            <SelectRaidList
              users={users}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
          <div>
            <SelectedRaidList users={selectedUsers} />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" className="w-full md:w-auto">
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
