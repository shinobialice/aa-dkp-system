import type { FrameOption } from "@/actions/profileStyle";

const FRAME_GROUPS = [
  { type: "free", title: "Для всех" },
  { type: "class", title: "За класс" },
  { type: "rank", title: "За ранг в киллкаунте" },
  { type: "tenure", title: "За стаж в гильдии" },
];

export function frameGroups(frames: FrameOption[], selectedId: number | null) {
  return FRAME_GROUPS.map((group) => ({
    title: group.title,
    showsCondition: group.type !== "free",
    frames: frames.filter(
      (frame) =>
        frame.unlockType === group.type &&
        (frame.unlockType !== "class" ||
          frame.isUnlocked ||
          frame.id === selectedId),
    ),
  })).filter((group) => group.frames.length > 0);
}
