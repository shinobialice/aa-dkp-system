import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import ScreenshotsLinkButton from "@/widgets/calendar/ScreenshotsLinkButton";

type Props = {
  canEditEvents: boolean;
  canEditScreenshots: boolean;
  onCreate: () => void;
};

export default function AttendanceHeader({
  canEditEvents,
  canEditScreenshots,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Посещаемость</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Рейды гильдии и кто на них был · время московское
        </p>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <div className="w-full min-w-0 sm:w-auto">
          <ScreenshotsLinkButton canEdit={canEditScreenshots} />
        </div>
        {canEditEvents && (
          <Button
            className="w-full cursor-pointer sm:w-auto"
            onClick={onCreate}
          >
            <Plus />
            Добавить посещение
          </Button>
        )}
      </div>
    </div>
  );
}
