import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

export function EditToggleButton({
  editMode,
  toggle,
  classname,
}: {
  editMode: boolean;
  toggle: () => void;
  classname?: string;
}) {
  return (
    <div className={`${classname}`}>
      <Button size="sm" variant="outline" onClick={toggle}>
        {editMode ? (
          "Сохранить"
        ) : (
          <>
            <Pen className="h-3 w-3 mr-1" /> Редактировать
          </>
        )}
      </Button>
    </div>
  );
}
