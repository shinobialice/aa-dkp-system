import { JSX } from "react";
import {
  BowArrow,
  Drum,
  HeartPlus,
  Music,
  Shield,
  Sword,
  Wand,
} from "lucide-react";
import { Pistol } from "@/shared/ui/icons/Pistol";

export const classIcons: Record<string, JSX.Element> = {
  Хил: <HeartPlus className="size-4" />,
  Танцор: <Drum className="size-4" />,
  Тактик: <Shield className="size-4" />,
  Лук: <BowArrow className="size-4" />,
  Милик: <Sword className="size-4" />,
  Маг: <Wand className="size-4" />,
  Бард: <Music className="size-4" />,
  Стрелок: <Pistol className="size-4" />,
};

export const classList = [
  "Хил",
  "Танцор",
  "Тактик",
  "Лук",
  "Милик",
  "Маг",
  "Бард",
  "Стрелок",
];

export function sanitizeGearScoreInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function parseVkNameInput(input: string): string {
  const match = input.match(/vk\.(?:com|ru)\/([a-zA-Z0-9_.]+)/);
  return match ? match[1] : input;
}
