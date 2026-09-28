"use client";

import { Typography, Button, Separator } from "@/shared/ui";
import { PlusIcon } from "lucide-react";
import { FC, useState } from "react";
import { AddManualKillCount } from "./ui/add-manual";

interface AddKillCountProps {
  isCanEdit: boolean;
}

export const AddKillCount: FC<AddKillCountProps> = ({ isCanEdit }) => {
  const [chooseState, setChooseState] = useState<"manual" | undefined>();

  const onBack = () => {
    setChooseState(undefined);
  };

  return (
    <>
      <div className="content-center">
        {!chooseState && (
          <Typography className="text-center mb-4" variant="large">
            За сегодняшний день киллкаунт еще не добавлен
          </Typography>
        )}
        {!chooseState && isCanEdit && (
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="default"
              onClick={() => setChooseState("manual")}
            >
              <PlusIcon /> Добавить вручную
            </Button>
            <Separator orientation="vertical" />
          </div>
        )}
        {chooseState === "manual" && (
          <AddManualKillCount isCanEdit={isCanEdit} onBack={onBack} />
        )}
      </div>
    </>
  );
};
