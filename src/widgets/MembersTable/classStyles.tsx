import { JSX } from "react";
import { BowArrow, Drum, HeartPlus, Music, Shield, Sword, Wand } from "lucide-react";

export const classColors: Record<string, string> = {
  Хил: "#ec4899",
  Лук: "#eab308",
  Маг: "#a855f7",
  Милик: "#f97316",
  Тактик: "#22c55e",
  Танцор: "#3b82f6",
  Бард: "#ef4444",
};

export const classIcons: Record<string, JSX.Element> = {
  Хил: <HeartPlus className="size-4" />,
  Танцор: <Drum className="size-4" />,
  Тактик: <Shield className="size-4" />,
  Лук: <BowArrow className="size-4" />,
  Милик: <Sword className="size-4" />,
  Маг: <Wand className="size-4" />,
  Бард: <Music className="size-4" />,
};
