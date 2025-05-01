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
import createRaidEvent from "@/src/actions/createRaidEvent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function CreateEvent() {
  const [category, setCategory] = React.useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = React.useState<string | null>(null);
  const [dkpPoints, setDkpPoints] = React.useState<number>(0);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [errors, setErrors] = React.useState({
    category: false,
    selectedBoss: false,
    selectedDate: false,
  });
  const [success, setSuccess] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false); // для закрытия модалки

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

  const handleCreateEvent = async () => {
    const newErrors = {
      category: !category,
      selectedBoss: !selectedBoss,
      selectedDate: !selectedDate,
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    const userIds = selectedUsers.map((u) => u.id);

    await createRaidEvent(
      category as string,
      selectedBoss as string,
      dkpPoints,
      selectedDate as Date,
      userIds
    );

    setCategory(null);
    setSelectedBoss(null);
    setDkpPoints(0);
    setSelectedDate(null);
    setRowSelection({});
    setSuccess("Активность успешно создана");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <RaidDetailsForm
              users={users}
              setUsers={setUsers}
              category={category}
              setCategory={setCategory}
              selectedBoss={selectedBoss}
              setSelectedBoss={setSelectedBoss}
              dkpPoints={dkpPoints}
              setDkpPoints={setDkpPoints}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              errors={errors}
              setErrors={setErrors}
            />
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
          <Button onClick={handleCreateEvent} className="w-full md:w-auto">
            Создать
          </Button>
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Успех</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
