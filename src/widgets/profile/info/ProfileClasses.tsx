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
  Хил: <HeartPlus className="size-4" />,
  Танцор: <Drum className="size-4" />,
  Тактик: <Shield className="size-4" />,
  Лук: <BowArrow className="size-4" />,
  Милик: <Sword className="size-4" />,
  Маг: <Wand className="size-4" />,
  Бард: <Music className="size-4" />,
};

const classList = ["Хил", "Танцор", "Тактик", "Лук", "Милик", "Маг", "Бард"];

export default function ProfileClasses({
  user,
  formData,
  setFormData,
  editMode,
  canEditGs,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
  canEditGs: boolean;
}) {
  const canEdit = editMode && canEditGs;
  const hasSecondary =
    canEdit || user.secondary_class || user.secondary_class_gear_score;

  return (
    <>
      <div className="min-w-[140px] space-y-1.5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Класс
        </div>
        {canEdit ? (
          <div className="flex items-center gap-2">
            <Select
              value={formData.class ?? ""}
              onValueChange={(value) =>
                setFormData((prev: any) => ({ ...prev, class: value }))
              }
            >
              <SelectTrigger className="w-[110px] cursor-pointer">
                <SelectValue placeholder="Класс" />
              </SelectTrigger>
              <SelectContent>
                {classList.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-[70px]"
              value={formData.classGearScore ?? ""}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  classGearScore: e.target.value,
                }))
              }
            />
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5 text-sm font-semibold">
            <span className="inline-flex items-center">
              {classIcons[formData.class] ?? "❓"}
            </span>
            <span>{formData.class ?? "—"}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ГС {formData.classGearScore ?? "нет данных"}
            </span>
          </div>
        )}
      </div>

      {hasSecondary && (
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Доп. класс
          </div>
          {canEdit ? (
            <div className="flex items-center gap-2">
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
                <SelectTrigger className="w-[110px] cursor-pointer">
                  <SelectValue placeholder="Класс" />
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
              <Input
                className="w-[70px]"
                value={formData.secondaryClassGearScore ?? ""}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    secondaryClassGearScore: e.target.value,
                  }))
                }
                disabled={!formData.secondaryClass}
              />
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 text-sm font-semibold">
              <span className="inline-flex items-center">
                {classIcons[formData.secondaryClass] ?? "❓"}
              </span>
              <span>{formData.secondaryClass ?? "Нет данных"}</span>
              <span className="text-xs font-normal text-muted-foreground">
                ГС {formData.secondaryClassGearScore ?? "нет данных"}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
