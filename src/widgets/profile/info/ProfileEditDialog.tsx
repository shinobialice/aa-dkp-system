"use client";
import { ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, parse } from "date-fns";
import editUser from "@/actions/editUser";
import getUser from "@/actions/getUser";
import saveUserArchetype from "@/actions/saveUserArchetype";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";
import type {
  ArchetypeSlot,
  RoleSlot,
  UserArchetype,
} from "@/actions/getUserArchetype";
import ArchetypeSpecPicker, {
  SPEC_KEYS,
  isArchetypeComplete,
} from "@/widgets/profile/archetype/ArchetypeSpecPicker";
import InventoryCategories from "@/widgets/profile/inventory/InventoryCategories";
import {
  Button,
  DateTimePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  classIcons,
  classList,
  parseVkNameInput,
  sanitizeGearScoreInput,
} from "./roleClasses";

type RoleDraft = {
  className: string | null;
  gs: string;
  archetype: ArchetypeSlot;
};

type Draft = {
  username: string;
  vkName: string;
  joinedAt: string;
  roles: Record<RoleSlot, RoleDraft>;
};

type Step = "main" | "inventory";

const ROLE_SLOTS: RoleSlot[] = [1, 2, 3];

const ROLE_COLUMNS: Record<RoleSlot, { className: string; gs: string }> = {
  1: { className: "class", gs: "class_gear_score" },
  2: { className: "secondary_class", gs: "secondary_class_gear_score" },
  3: { className: "tertiary_class", gs: "tertiary_class_gear_score" },
};

const ROLE_TITLES: Record<RoleSlot, string> = {
  1: "Основная роль",
  2: "Роль 2",
  3: "Роль 3",
};

const NO_ROLE = "Нет";

function roleExists(user: any, slot: RoleSlot): boolean {
  if (slot === 1) return true;
  const columns = ROLE_COLUMNS[slot];
  return !!user[columns.className] || user[columns.gs] != null;
}

function buildDraft(user: any, archetype: UserArchetype): Draft {
  const roleDraft = (slot: RoleSlot): RoleDraft => {
    const columns = ROLE_COLUMNS[slot];
    return {
      className: user[columns.className] ?? null,
      gs: user[columns.gs] != null ? String(user[columns.gs]) : "",
      archetype: archetype[slot],
    };
  };

  return {
    username: user.username ?? "",
    vkName: user.vk_name ?? "",
    joinedAt: user.joined_at ? user.joined_at.slice(0, 10) : "",
    roles: { 1: roleDraft(1), 2: roleDraft(2), 3: roleDraft(3) },
  };
}

function toGs(value: string): number | null {
  return value === "" ? null : Number(value);
}

function archetypeChanged(a: ArchetypeSlot, b: ArchetypeSlot): boolean {
  return SPEC_KEYS.some((key) => (a[key] ?? null) !== (b[key] ?? null));
}

function Field({
  label,
  required,
  locked,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  locked?: boolean;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {required && !locked && <span className="text-destructive">*</span>}
        {locked && <Lock className="size-3" />}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "main", label: "Основное" },
    { id: "inventory", label: "Инвентарь" },
  ];

  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          {i > 0 && <div className="h-px w-6 bg-border" />}
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
              s.id === step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <span
            className={cn(
              s.id === step ? "font-medium" : "text-muted-foreground",
            )}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  user,
  archetype,
  inventory,
  onInventoryChange,
  onSaved,
  canEditNickname,
  canEditGs,
  canAddExtraRole,
  canEditArchetype,
  canEditVk,
  canEditJoinedAt,
  canEditInventory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  archetype: UserArchetype;
  inventory: any[];
  onInventoryChange: () => void;
  onSaved: (result: {
    user: any;
    archetype: UserArchetype;
    usernameHistory: Awaited<ReturnType<typeof getUsernameHistory>>;
  }) => void;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditArchetype: boolean;
  canEditVk: boolean;
  canEditJoinedAt: boolean;
  canEditInventory: boolean;
}) {
  const [step, setStep] = useState<Step>("main");
  const [initial, setInitial] = useState(() => buildDraft(user, archetype));
  const [draft, setDraft] = useState(initial);
  const [revealedSlots, setRevealedSlots] = useState<RoleSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const visibleSlots = ROLE_SLOTS.filter(
    (slot) => roleExists(user, slot) || revealedSlots.includes(slot),
  );
  const nextHiddenSlot = ROLE_SLOTS.find(
    (slot) => !visibleSlots.includes(slot),
  );

  const isRoleEditable = (slot: RoleSlot) =>
    slot === 1 || roleExists(user, slot) ? canEditGs : canAddExtraRole;
  const isRoleFilled = (slot: RoleSlot) =>
    slot === 1 || !!draft.roles[slot].className;

  const roleErrors = (slot: RoleSlot) => {
    const role = draft.roles[slot];
    const editable = isRoleEditable(slot);
    const filled = isRoleFilled(slot);
    return {
      className: editable && slot === 1 && !role.className,
      gs: editable && filled && !role.gs,
      archetype:
        canEditArchetype && filled && !isArchetypeComplete(role.archetype),
    };
  };

  const usernameError = canEditNickname && !draft.username.trim();
  const hasErrors =
    usernameError ||
    visibleSlots.some((slot) => Object.values(roleErrors(slot)).some(Boolean));

  const hasLockedFields =
    !canEditNickname ||
    !canEditVk ||
    !canEditGs ||
    !canEditArchetype ||
    !canEditJoinedAt;

  const updateRole = (slot: RoleSlot, patch: Partial<RoleDraft>) => {
    setDraft((prev) => ({
      ...prev,
      roles: { ...prev.roles, [slot]: { ...prev.roles[slot], ...patch } },
    }));
  };

  const basicFieldsChanged = () =>
    draft.username !== initial.username ||
    draft.vkName !== initial.vkName ||
    draft.joinedAt !== initial.joinedAt ||
    ROLE_SLOTS.some(
      (slot) =>
        draft.roles[slot].className !== initial.roles[slot].className ||
        draft.roles[slot].gs !== initial.roles[slot].gs,
    );

  const handleSave = async () => {
    setSubmitted(true);
    if (hasErrors) {
      toast.error("Заполни обязательные поля");
      return;
    }

    setSaving(true);
    try {
      if (basicFieldsChanged()) {
        const { roles } = draft;
        await editUser(
          user.id,
          canEditNickname ? draft.username.trim() : user.username,
          roles[1].className,
          toGs(roles[1].gs),
          roles[2].className,
          toGs(roles[2].gs),
          roles[3].className,
          toGs(roles[3].gs),
          draft.vkName.trim() || null,
          draft.joinedAt === initial.joinedAt
            ? user.joined_at
            : draft.joinedAt || null,
        );
      }

      let nextArchetype = archetype;
      if (canEditArchetype) {
        for (const slot of ROLE_SLOTS) {
          const role = draft.roles[slot];
          if (!isRoleFilled(slot)) continue;
          if (!archetypeChanged(role.archetype, archetype[slot])) continue;
          nextArchetype = await saveUserArchetype(user.id, slot, {
            specialization1: role.archetype.specialization1,
            specialization2: role.archetype.specialization2,
            specialization3: role.archetype.specialization3,
          });
        }
      }

      const [freshUser, usernameHistory] = await Promise.all([
        getUser(user.id),
        getUsernameHistory(user.id),
      ]);
      onSaved({ user: freshUser, archetype: nextArchetype, usernameHistory });
      setInitial(draft);
      setSubmitted(false);
      toast.success("Профиль сохранён");

      if (canEditInventory) {
        setStep("inventory");
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить профиль",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col",
          step === "inventory" ? "sm:max-w-3xl" : "sm:max-w-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          {canEditInventory && <StepIndicator step={step} />}
          {step === "main" ? (
            hasLockedFields && (
              <DialogDescription className="flex items-center gap-1.5">
                <Lock className="size-3.5 shrink-0" />
                Серые поля сейчас изменить нельзя — это настраивает
                администратор.
              </DialogDescription>
            )
          ) : (
            <DialogDescription>
              Изменения инвентаря сохраняются сразу.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6">
          {step === "main" ? (
            <div className="space-y-5 pb-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Ник"
                  required
                  locked={!canEditNickname}
                  error={submitted && usernameError ? "Укажи ник" : null}
                >
                  <Input
                    value={draft.username}
                    disabled={!canEditNickname}
                    aria-invalid={submitted && usernameError}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field label="VK" locked={!canEditVk}>
                  <Input
                    value={draft.vkName}
                    disabled={!canEditVk}
                    placeholder="Ссылка или короткое имя"
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        vkName: parseVkNameInput(e.target.value),
                      }))
                    }
                  />
                </Field>
                <Field
                  label="Дата вступления"
                  locked={!canEditJoinedAt}
                  hint={
                    canEditJoinedAt ? undefined : "Меняют только администраторы"
                  }
                >
                  <DateTimePicker
                    classNames={{ trigger: "w-full" }}
                    hideTime
                    disabled={!canEditJoinedAt}
                    value={
                      draft.joinedAt
                        ? parse(draft.joinedAt, "yyyy-MM-dd", new Date())
                        : undefined
                    }
                    onChange={(date) =>
                      setDraft((prev) => ({
                        ...prev,
                        joinedAt: date ? format(date, "yyyy-MM-dd") : "",
                      }))
                    }
                  />
                </Field>
              </div>

              {visibleSlots.map((slot) => {
                const role = draft.roles[slot];
                const editable = isRoleEditable(slot);
                const removable = slot !== 1 && roleExists(user, slot);
                const errors = submitted
                  ? roleErrors(slot)
                  : { className: false, gs: false, archetype: false };

                return (
                  <div key={slot} className="space-y-4 rounded-lg border p-4">
                    <div className="text-sm font-semibold">
                      {ROLE_TITLES[slot]}
                    </div>
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
                            value === NO_ROLE
                              ? updateRole(slot, { className: null, gs: "" })
                              : updateRole(slot, { className: value })
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
                              <SelectItem value={NO_ROLE}>
                                Нет (убрать роль)
                              </SelectItem>
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
                        required={isRoleFilled(slot)}
                        locked={!editable}
                        error={errors.gs ? "Укажи ГС" : null}
                      >
                        <Input
                          inputMode="numeric"
                          maxLength={5}
                          value={role.gs}
                          disabled={!editable || !isRoleFilled(slot)}
                          aria-invalid={errors.gs}
                          onChange={(e) =>
                            updateRole(slot, {
                              gs: sanitizeGearScoreInput(e.target.value),
                            })
                          }
                        />
                      </Field>
                    </div>
                    {isRoleFilled(slot) && (
                      <Field
                        label="Класс персонажа"
                        required
                        locked={!canEditArchetype}
                        error={
                          errors.archetype ? "Выбери 3 специализации" : null
                        }
                      >
                        <ArchetypeSpecPicker
                          value={role.archetype}
                          showLabels={false}
                          disabled={!canEditArchetype}
                          invalid={errors.archetype}
                          onChange={(key, specId) =>
                            updateRole(slot, {
                              archetype: { ...role.archetype, [key]: specId },
                            })
                          }
                        />
                      </Field>
                    )}
                  </div>
                );
              })}

              {canAddExtraRole && nextHiddenSlot && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() =>
                    setRevealedSlots((prev) => [...prev, nextHiddenSlot])
                  }
                >
                  <Plus className="size-4" />
                  Ещё роль
                </Button>
              )}
            </div>
          ) : (
            <InventoryCategories
              canEdit
              inventory={inventory}
              userId={user.id}
              onChange={onInventoryChange}
            />
          )}
        </div>

        <DialogFooter>
          {step === "main" ? (
            <>
              <Button
                variant="ghost"
                className="cursor-pointer"
                disabled={saving}
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button
                className="cursor-pointer"
                disabled={saving}
                onClick={handleSave}
              >
                {saving
                  ? "Сохранение..."
                  : canEditInventory
                    ? "Далее"
                    : "Сохранить"}
                {!saving && canEditInventory && <ArrowRight />}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => setStep("main")}
              >
                <ArrowLeft />
                Назад
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Готово
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
