import { JSX, useState } from "react";
import {
  BowArrow,
  Drum,
  HeartPlus,
  Music,
  Plus,
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
import { ArchetypeSummary } from "@/widgets/profile/archetype/ArchetypeSummary";
import type { ArchetypeSlot, UserArchetype } from "@/actions/getUserArchetype";

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

// Второстепенная роль (2-я/3-я) — тот же вид, что и основная роль:
// без лейбла, просто иконка + название + ГС.
function ExtraRoleField({
  editable,
  roleValue,
  gsValue,
  onRoleChange,
  onGsChange,
  archetype,
}: {
  editable: boolean;
  roleValue: string | null;
  gsValue: string | number | null;
  onRoleChange: (value: string) => void;
  onGsChange: (value: string) => void;
  archetype: ArchetypeSlot;
}) {
  return (
    <div className="min-w-[140px] space-y-1">
      {editable ? (
        <div className="flex items-center gap-2">
          <Select
            value={roleValue ?? "Нет"}
            onValueChange={(value) =>
              onRoleChange(value === "Нет" ? "" : value)
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
            value={gsValue ?? ""}
            onChange={(e) => onGsChange(e.target.value)}
            disabled={!roleValue}
          />
        </div>
      ) : (
        <div className="flex items-baseline gap-1.5 text-sm font-semibold">
          <span className="inline-flex items-center">
            {classIcons[roleValue ?? ""] ?? "❓"}
          </span>
          <span>{roleValue ?? "Нет данных"}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {gsValue ?? "нет данных"} ГС
          </span>
        </div>
      )}
      <ArchetypeSummary archetype={archetype} size={22} />
    </div>
  );
}

export default function ProfileClasses({
  user,
  formData,
  setFormData,
  editMode,
  canEditGs,
  canAddExtraRole,
  archetype,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  archetype: UserArchetype;
}) {
  const canEdit = editMode && canEditGs;

  // Слоты, которые самостоятельно "раскрыл" для добавления в эту сессию
  // редактирования — чтобы пустые Роль 2/3 не вываливались на экран сразу
  // обе разом, а появлялись по одной по кнопке "Ещё роль".
  const [revealedSlots, setRevealedSlots] = useState<string[]>([]);

  // "Уже есть роль" смотрим по стабильным серверным данным (user), а не по
  // formData — иначе как только самоправщик выберет роль в пустом слоте,
  // условие editable переключится с canAddExtraRole на canEditGs прямо
  // посреди редактирования и поле неожиданно станет недоступным.
  const extraSlots = [
    {
      key: "secondary",
      hasData:
        !!user.secondary_class || user.secondary_class_gear_score != null,
      roleValue: formData.secondaryClass ?? null,
      gsValue: formData.secondaryClassGearScore ?? null,
      archetype: archetype[2],
      onRoleChange: (value: string) =>
        setFormData((prev: any) => ({
          ...prev,
          secondaryClass: value || null,
          secondaryClassGearScore: value ? prev.secondaryClassGearScore : null,
        })),
      onGsChange: (value: string) =>
        setFormData((prev: any) => ({
          ...prev,
          secondaryClassGearScore: value,
        })),
    },
    {
      key: "tertiary",
      hasData:
        !!user.tertiary_class || user.tertiary_class_gear_score != null,
      roleValue: formData.tertiaryClass ?? null,
      gsValue: formData.tertiaryClassGearScore ?? null,
      archetype: archetype[3],
      onRoleChange: (value: string) =>
        setFormData((prev: any) => ({
          ...prev,
          tertiaryClass: value || null,
          tertiaryClassGearScore: value ? prev.tertiaryClassGearScore : null,
        })),
      onGsChange: (value: string) =>
        setFormData((prev: any) => ({
          ...prev,
          tertiaryClassGearScore: value,
        })),
    },
  ];

  const visibleSlots = extraSlots.filter(
    (slot) => slot.hasData || revealedSlots.includes(slot.key),
  );
  const nextHiddenSlot = extraSlots.find(
    (slot) => !slot.hasData && !revealedSlots.includes(slot.key),
  );
  const showAddButton = editMode && canAddExtraRole && !!nextHiddenSlot;

  return (
    <>
      <div className="min-w-[140px] space-y-1">
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
              {formData.classGearScore ?? "нет данных"} ГС
            </span>
          </div>
        )}
        <ArchetypeSummary archetype={archetype[1]} size={22} />
      </div>

      {visibleSlots.map((slot) => (
        <ExtraRoleField
          key={slot.key}
          editable={editMode && (slot.hasData ? canEditGs : canAddExtraRole)}
          roleValue={slot.roleValue}
          gsValue={slot.gsValue}
          onRoleChange={slot.onRoleChange}
          onGsChange={slot.onGsChange}
          archetype={slot.archetype}
        />
      ))}

      {showAddButton && (
        <div className="flex items-end pb-1">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
            onClick={() =>
              nextHiddenSlot &&
              setRevealedSlots((prev) => [...prev, nextHiddenSlot.key])
            }
          >
            <Plus className="size-3.5" />
            Ещё роль
          </button>
        </div>
      )}
    </>
  );
}
