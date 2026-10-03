import type { RoleSlot } from "@/actions/getUserArchetype";
import ArchetypeSpecPicker from "@/widgets/profile/archetype/ArchetypeSpecPicker";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { classIcons, classList, sanitizeGearScoreInput } from "../roleClasses";
import Field from "./Field";
import { ROLE_TITLES, type RoleDraft } from "./profileDraft";

export type RoleErrors = {
  className: boolean;
  gs: boolean;
  archetype: boolean;
};

type Props = {
  slot: RoleSlot;
  role: RoleDraft;
  editable: boolean;
  removable: boolean;
  filled: boolean;
  canEditArchetype: boolean;
  errors: RoleErrors;
  onChange: (patch: Partial<RoleDraft>) => void;
};

const NO_ROLE = "Нет";

export default function RoleCard({
  slot,
  role,
  editable,
  removable,
  filled,
  canEditArchetype,
  errors,
  onChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="text-sm font-semibold">{ROLE_TITLES[slot]}</div>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <Field
          label="Класс"
          required={slot === 1}
          locked={!editable}
          error={errors.className ? "Выбери класс" : null}
          hint={
            removable && !role.className
              ? "Роль будет убрана при сохранении"
              : undefined
          }
        >
          <Select
            value={role.className ?? ""}
            disabled={!editable}
            onValueChange={(value) =>
              onChange(
                value === NO_ROLE
                  ? { className: null, gs: "" }
                  : { className: value },
              )
            }
          >
            <SelectTrigger
              className="w-full cursor-pointer"
              aria-invalid={errors.className}
            >
              <SelectValue placeholder="Выбери класс" />
            </SelectTrigger>
            <SelectContent>
              {removable && (
                <SelectItem value={NO_ROLE}>Нет (убрать роль)</SelectItem>
              )}
              {classList.map((className) => (
                <SelectItem key={className} value={className}>
                  <span className="flex items-center gap-2">
                    {classIcons[className]}
                    {className}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="ГС"
          required={filled}
          locked={!editable}
          error={errors.gs ? "Укажи ГС" : null}
        >
          <Input
            inputMode="numeric"
            maxLength={5}
            value={role.gs}
            disabled={!editable || !filled}
            aria-invalid={errors.gs}
            onChange={(event) =>
              onChange({ gs: sanitizeGearScoreInput(event.target.value) })
            }
          />
        </Field>
      </div>
      {filled && (
        <Field
          label="Класс персонажа"
          required
          locked={!canEditArchetype}
          error={errors.archetype ? "Выбери 3 специализации" : null}
        >
          <ArchetypeSpecPicker
            value={role.archetype}
            showLabels={false}
            disabled={!canEditArchetype}
            invalid={errors.archetype}
            onChange={(key, specId) =>
              onChange({ archetype: { ...role.archetype, [key]: specId } })
            }
          />
        </Field>
      )}
    </div>
  );
}
