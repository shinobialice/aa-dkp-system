import { TabsList, TabsTrigger } from "@/shared/ui";

export default function CharacterTabsSwitcher() {
  return (
    <TabsList>
      <TabsTrigger className="cursor-pointer" value="equipment">
        Экипировка
      </TabsTrigger>
      <TabsTrigger className="cursor-pointer" value="seals">
        Печати героя
      </TabsTrigger>
      <TabsTrigger className="cursor-pointer" value="class">
        Класс персонажа
      </TabsTrigger>
    </TabsList>
  );
}
