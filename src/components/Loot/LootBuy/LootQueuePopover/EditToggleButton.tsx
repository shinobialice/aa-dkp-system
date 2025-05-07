"use client";
import { Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUserTag from "@/src/hooks/useUserTag";

export function EditToggleButton({
  editMode,
  toggle,
  classname,
}: {
  editMode: boolean;
  toggle: () => void;
  classname?: string;
}) {
  const isAdmin = useUserTag("Администратор");
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
