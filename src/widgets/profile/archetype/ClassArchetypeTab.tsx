"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveUserArchetype from "@/actions/saveUserArchetype";
import saveUserSkillBuild from "@/actions/saveUserSkillBuild";
import type { RoleSlot, UserArchetype } from "@/actions/getUserArchetype";
import type { UserSkillBuild } from "@/actions/getUserSkillBuild";
import { type SpecKey } from "./ArchetypeSpecPicker";
import SkillBuildEditor from "./SkillBuildEditor";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { errorMessage } from "@/shared/lib/errorMessage";
import { specIdsOf, hasAnySkillSelected } from "./archetypeRoles";
import BuildEditor from "./BuildEditor";
import BuildView from "./BuildView";

export default function ClassArchetypeTab({
  userId,
  roleSlot,
  archetype,
  onChange,
  skillBuild,
  onSkillBuildChange,
  canEdit,
}: {
  userId: number;
  roleSlot: RoleSlot;
  archetype: UserArchetype;
  onChange: (archetype: UserArchetype) => void;
  skillBuild: UserSkillBuild;
  onSkillBuildChange: (skillBuild: UserSkillBuild) => void;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<UserArchetype>(archetype);
  const [skillBuildDraft, setSkillBuildDraft] =
    useState<UserSkillBuild>(skillBuild);

  const activeSlots = [roleSlot];

  const startEditing = () => {
    setDraft(archetype);
    setSkillBuildDraft(skillBuild);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(archetype);
    setSkillBuildDraft(skillBuild);
  };

  const setSpec = (slot: RoleSlot, key: SpecKey, value: string | null) => {
    setDraft((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedArchetype = archetype;
      let updatedSkillBuild = skillBuild;
      for (const slot of activeSlots) {
        const slotDraft = draft[slot];
        updatedArchetype = await saveUserArchetype(userId, slot, {
          specialization1: slotDraft.specialization1,
          specialization2: slotDraft.specialization2,
          specialization3: slotDraft.specialization3,
        });

        const slotSpecs = specIdsOf(slotDraft);
        const slotBuildDraft = Object.fromEntries(
          Object.entries(skillBuildDraft[slot] ?? {}).filter(([specId]) =>
            slotSpecs.includes(specId),
          ),
        );
        updatedSkillBuild = await saveUserSkillBuild(
          userId,
          slot,
          slotBuildDraft,
        );
      }
      onChange(updatedArchetype);
      onSkillBuildChange(updatedSkillBuild);
      setEditing(false);
      toast.success("Класс сохранён");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить класс"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="min-h-187.5 gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <CharacterTabsSwitcher group="character" />
          {canEdit && !editing && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={startEditing}
            >
              Изменить
            </Button>
          )}
          {canEdit && editing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={cancelEditing}
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                className="cursor-pointer"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {editing && (
          <p className="text-sm text-muted-foreground">
            Класс собирается из 3 специализаций — название подставляется само по
            таблице сочетаний.
          </p>
        )}
        {activeSlots.map((slot, i) => {
          const specIds = specIdsOf(editing ? draft[slot] : archetype[slot]);
          const showBuild =
            specIds.length > 0 &&
            (editing || hasAnySkillSelected(skillBuild[slot]));

          return (
            <div key={slot} className={i > 0 ? "border-t pt-4" : undefined}>
              {editing ? (
                <BuildEditor
                  slot={slot}
                  showLabel={false}
                  draft={draft[slot]}
                  onSpecChange={(key, value) => setSpec(slot, key, value)}
                />
              ) : (
                <BuildView
                  slot={slot}
                  showLabel={false}
                  archetype={archetype[slot]}
                />
              )}
              {showBuild && (
                <div className="mt-3">
                  <SkillBuildEditor
                    specializationIds={specIds}
                    build={
                      (editing ? skillBuildDraft[slot] : skillBuild[slot]) ?? {}
                    }
                    editable={editing}
                    onChange={(next) =>
                      setSkillBuildDraft((prev) => ({ ...prev, [slot]: next }))
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
