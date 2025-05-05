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
      <Button className="cursor-pointer" size="sm" variant="outline" onClick={toggle}>
        {(() => {
          if (editMode) {
            return "Сохранить";
          } else {
            return (
              <>
                <Pen className="h-3 w-3 mr-1" /> Редактировать
              </>
            );
          }
        })()}
      </Button>
    </div>
  );
}
