import { TabsList, TabsTrigger } from "@/shared/ui";

type Props = {
  group: keyof typeof SECTIONS;
};

const SECTIONS = {
  seals: [
    ["ephe", "Печати Эфе"],
    ["hero", "Печати героя"],
  ],
  character: [
    ["equipment", "Экипировка"],
    ["class", "Класс персонажа"],
  ],
} as const;

export default function CharacterTabsSwitcher({ group }: Props) {
  return (
    <TabsList className="max-w-full justify-start overflow-x-auto [scrollbar-width:none]">
      {SECTIONS[group].map(([value, label]) => (
        <TabsTrigger
          key={value}
          className="shrink-0 cursor-pointer px-3"
          value={value}
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
