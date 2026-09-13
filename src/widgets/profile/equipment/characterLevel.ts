export const MIN_CHARACTER_LEVEL = 1;
export const MAX_CHARACTER_LEVEL = 70;

export function isValidCharacterLevel(level: number): boolean {
  return (
    Number.isInteger(level) &&
    level >= MIN_CHARACTER_LEVEL &&
    level <= MAX_CHARACTER_LEVEL
  );
}
