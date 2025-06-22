"use client";
import { Pen } from "lucide-react";
import { Button } from "@/components/ui/button";


export function EditToggleButton({
  editMode,
  toggle,
  classname,
  isAdmin
}: {
  editMode: boolean;
  toggle: () => void;
  classname?: string;
  isAdmin?: boolean;
}) {

  return (
    <div className={`${classname}`}>
      {isAdmin && (
        <Button
          className="cursor-pointer"
          size="sm"
          variant="outline"
          onClick={toggle}
        >
          {(() => {
            if (editMode) {
              return "Сохранить";
            }
            return (
              <>
                <Pen className="h-3 w-3 mr-1" /> Редактировать
              </>
            );
          })()}
        </Button>
      )}
    </div>
  );
}
