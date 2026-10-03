export type RoleSlot = 1 | 2 | 3;

export function isRoleSlot(value: number): value is RoleSlot {
  return value === 1 || value === 2 || value === 3;
}
