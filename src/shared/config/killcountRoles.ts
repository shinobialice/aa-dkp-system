// Роли, которые попадают в киллкаунт из сканера: только ДД. Хил, Бард, Танцор
// и Тактик в киллкаунт со сканера не идут.
export const KILLCOUNT_ROLES = ["Милик", "Стрелок", "Лук", "Маг"];

type RoleClasses = {
  class: string | null;
  secondary_class: string | null;
  tertiary_class: string | null;
};

type ArchetypeSpecs = {
  role_slot: number;
  specialization_1: string | null;
  specialization_2: string | null;
  specialization_3: string | null;
};

const ROLE_FIELDS = ["class", "secondary_class", "tertiary_class"] as const;

// Роль, на которой игрок был на прайме: слот архетипа с теми же тремя ветками,
// что увидел сканер. Если такого слота нет — основная роль игрока.
export function resolveKillcountRole(
  user: RoleClasses,
  archetypes: ArchetypeSpecs[],
  specs: string[] | undefined,
): { role: string | null; byArchetype: boolean } {
  if (specs?.length === 3) {
    const wanted = [...specs].sort().join("+");
    for (const slot of archetypes) {
      const field = ROLE_FIELDS[slot.role_slot - 1];
      const have = [
        slot.specialization_1,
        slot.specialization_2,
        slot.specialization_3,
      ];
      if (!field || have.some((id) => !id)) continue;
      if ([...have].sort().join("+") === wanted && user[field]) {
        return { role: user[field], byArchetype: true };
      }
    }
  }
  return { role: user.class, byArchetype: false };
}
