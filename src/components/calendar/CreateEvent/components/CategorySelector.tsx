import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CategorySelector({
  category,
  setCategory,
  setSelectedBoss,
  setSelectedBosses,
  setIsPvp,
  setIsPvpLong,
  setErrors,
  errors,
}: {
  category: string | null;
  setCategory: (value: string | null) => void;
  setSelectedBoss: (value: string | null) => void;
  setSelectedBosses: React.Dispatch<React.SetStateAction<any[]>>;
  setIsPvp: (val: boolean) => void;
  setIsPvpLong: (val: boolean) => void;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: { category: boolean };
}) {
  return (
    <>
      <Label>Категория</Label>
      <Select
        onValueChange={(value) => {
          setCategory(value);
          setSelectedBoss(null);
          setSelectedBosses([]);
          setIsPvp(false);
          setIsPvpLong(false);
          setErrors((prev) => ({ ...prev, category: false }));
        }}
        value={category ?? undefined}
      >
        <SelectTrigger className="w-[270px] cursor-pointer">
          <SelectValue
            className="cursor-pointer"
            placeholder="Выберите категорию события"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="Прайм">
            Прайм
          </SelectItem>
          <SelectItem className="cursor-pointer" value="АГЛ">
            АГЛ
          </SelectItem>
        </SelectContent>
      </Select>
      {errors.category && (
        <p className="text-sm text-red-500">Обязательное поле</p>
      )}
    </>
  );
}
