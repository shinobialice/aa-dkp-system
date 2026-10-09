import { CLASS_ORDER } from "@/shared/config/classes";
import {
  FRAME_RANK_OPTIONS,
  type FrameUnlockType,
} from "@/shared/config/profileStyle";

export type FrameCondition = {
  unlockClass: string;
  rankKills: string;
  years: string;
};

export const INITIAL_CONDITION: FrameCondition = {
  unlockClass: CLASS_ORDER[0],
  rankKills: String(FRAME_RANK_OPTIONS[0].minKills),
  years: "1",
};

export function conditionFields(
  type: FrameUnlockType,
  condition: FrameCondition,
) {
  return {
    unlockValue: unlockValue(type, condition),
    unlockClass: type === "class" ? condition.unlockClass : "",
  };
}

function unlockValue(type: FrameUnlockType, condition: FrameCondition) {
  if (type === "rank") return condition.rankKills;
  if (type === "tenure") return condition.years;
  return "0";
}
