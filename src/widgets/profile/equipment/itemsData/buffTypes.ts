export type CharacterBuffOption = {
  value: string;
  label: string;
  icon?: string;
  text: string;
  stats: Record<number, number>;
};

export type CharacterBuff = {
  id: number;
  name: string;
  icon: string;
  requiresBuffId?: number;
  options: CharacterBuffOption[];
};
