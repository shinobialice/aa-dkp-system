import { JSX } from "react";
import {
  BowArrow,
  Drum,
  HeartPlus,
  Music,
  Shield,
  Sword,
  Wand,
} from "lucide-react";
import { Input } from "@/shared/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

const classIcons: Record<string, JSX.Element> = {
  Хил: <HeartPlus className="text-xl" />,
  Танцор: <Drum className="text-xl" />,
  Тактик: <Shield className="text-xl" />,
  Лук: <BowArrow className="text-xl" />,
  Милик: <Sword className="text-xl" />,
  Маг: <Wand className="text-xl" />,
  Бард: <Music className="text-xl" />,
};

const classList = ["Хил", "Танцор", "Тактик", "Лук", "Милик", "Маг", "Бард"];

export default function ProfileClasses({
  user,
  formData,
  setFormData,
  editMode,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
}) {
  return (
    <div
      className={`grid gap-4 ${
        editMode || user.secondary_class || user.secondary_class_gear_score
          ? "grid-cols-1 md:grid-cols-2 place-items-center"
          : "grid-cols-1 place-items-center"
      }`}
    >
      {/* Primary Class */}
      <div className="space-y-2 ">
        <div className="text-lg flex justify-center items-center gap-2">
          {(() => {
            if (editMode) {
              return (
                <Select
                  value={formData.class ?? ""}
                  onValueChange={(value) =>
                    setFormData((prev: any) => ({ ...prev, class: value }))
                  }
                >
                  <SelectTrigger className="w-[100px] cursor-pointer">
                    <SelectValue placeholder="Выберите класс" />
                  </SelectTrigger>
                  <SelectContent>
                    {classList.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }
            return (
              <>
                {classIcons[formData.class] ?? "❓"} {formData.class ?? "—"}
              </>
            );
          })()}
        </div>

        <div className="text-sm text-gray-400 ">
          <span>ГС: </span>
          {(() => {
            if (editMode) {
              return (
                <Input
                  className="text-center text-white w-[100px]"
                  value={formData.classGearScore ?? ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      classGearScore: e.target.value,
                    }))
                  }
                />
              );
            }
            return formData.classGearScore ?? "Нет данных";
          })()}
        </div>
      </div>

      {/* Secondary Class — появляется даже если его нет, но только в editMode */}
      {(editMode ||
        user.secondary_class ||
        user.secondary_class_gear_score) && (
        <div className="space-y-2">
          <div className="text-lg flex justify-center items-center gap-2">
            {(() => {
              if (editMode) {
                return (
                  <Select
                    value={formData.secondaryClass ?? "Нет"}
                    onValueChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        secondaryClass: value === "Нет" ? null : value,
                        secondaryClassGearScore:
                          value === "Нет" ? null : prev.secondaryClassGearScore,
                      }))
                    }
                  >
                    <SelectTrigger className="w-[100px] cursor-pointer">
                      <SelectValue placeholder="Выберите класс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Нет">Нет</SelectItem>
                      {classList.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }
              return (
                <>
                  {classIcons[formData.secondaryClass] ?? "❓"}{" "}
                  {formData.secondaryClass ?? "Нет данных"}
                </>
              );
            })()}
          </div>

          <div className="text-sm text-gray-400">
            <span>ГС: </span>
            {(() => {
              if (editMode) {
                return (
                  <Input
                    className="text-center w-[100px]"
                    value={formData.secondaryClassGearScore ?? ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        secondaryClassGearScore: e.target.value,
                      }))
                    }
                    disabled={!formData.secondaryClass}
                  />
                );
              }
              return formData.secondaryClassGearScore ?? "Нет данных";
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
