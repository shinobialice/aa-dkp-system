"use client";
import { FC, useState } from "react";
import { KillCount } from "../../types";
import { Button, Input } from "@/shared/ui";
import { KillCountTable } from "../killcount-table";
import { setKillCountCurrent } from "../../api/current";

interface AddManualKillCountProps {
  onBack: () => void;
  isCanEdit: boolean;
}

export const AddManualKillCount: FC<AddManualKillCountProps> = ({
  onBack,
  isCanEdit,
}) => {
  const [tableData, setTableData] = useState<KillCount[]>([]);

  const [jsonInput, setJsonInput] = useState<string>("");

  const handleSaveClick = async () => {
    await setKillCountCurrent(tableData);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex gap-4 mb-4">
        <Button variant="secondary" className="w-fit" onClick={onBack}>
          Назад
        </Button>
        <Input
          // Напрямую вставляет данные в таблицу
          // Временное решение
          placeholder="JSON"
          onChange={(event) => {
            const value = event.currentTarget.value;

            try {
              const parsedValue: KillCount[] = JSON.parse(value);

              const formattedValue = parsedValue.map((item) => {
                const tempValue = item.userName.split(" ");

                return {
                  ...item,
                  userName: tempValue[0] ?? "",
                  comment: tempValue
                    .slice(1, tempValue.length)
                    .join(" ")
                    .replaceAll(/\(|\)/g, ""),
                };
              });

              setTableData(() => formattedValue);
            } catch (error) {
              console.error("Данные не сериализуемы", error);
              return;
            }

            setJsonInput(value);
          }}
          value={jsonInput}
        />
        <Button onClick={handleSaveClick}>Сохранить</Button>
      </div>

      <KillCountTable isCanEdit={isCanEdit} data={tableData} />
    </div>
  );
};
