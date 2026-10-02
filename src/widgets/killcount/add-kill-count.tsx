"use client";

import { FC, useState } from "react";
import { PlusIcon, Swords } from "lucide-react";
import { Button } from "@/shared/ui";
import { AddManualKillCount } from "./ui/add-manual";

interface AddKillCountProps {
  isCanEdit: boolean;
}

export const AddKillCount: FC<AddKillCountProps> = ({ isCanEdit }) => {
  const [manual, setManual] = useState(false);

  if (manual) {
    return (
      <AddManualKillCount
        isCanEdit={isCanEdit}
        onBack={() => setManual(false)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-4 py-14 text-center">
      <Swords className="size-8 text-muted-foreground" />
      <p className="text-base font-semibold">
        Киллкаунт за сегодня ещё не добавлен
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Он появится здесь после прайма. Прошлые дни — во вкладке «История».
      </p>
      {isCanEdit && (
        <Button className="mt-2 cursor-pointer" onClick={() => setManual(true)}>
          <PlusIcon /> Добавить вручную
        </Button>
      )}
    </div>
  );
};
