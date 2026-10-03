import type { WarOpponentsState } from "@/actions/warOpponents";
import { formatDateRange, formatStartDate } from "../warModel";

export type DraftRow = {
  key: string;
  id: number | null;
  name: string;
  startedAt: string | null;
  savedEndedAt: string | null;
  ended: boolean;
};

export function savedDraftRows(state: WarOpponentsState): DraftRow[] {
  return state.opponents.map((opponent) => ({
    key: `saved-${opponent.id}`,
    id: opponent.id,
    name: opponent.name,
    startedAt: opponent.startedAt,
    savedEndedAt: opponent.endedAt,
    ended: opponent.endedAt !== null,
  }));
}

export function newDraftRow(key: string): DraftRow {
  return {
    key,
    id: null,
    name: "",
    startedAt: null,
    savedEndedAt: null,
    ended: false,
  };
}

export function statusHint({
  isNew,
  startedAt,
  savedEndedAt,
  ended,
}: {
  isNew: boolean;
  startedAt: string | null;
  savedEndedAt: string | null;
  ended: boolean;
}): string {
  if (isNew) return "счётчик пойдёт с момента сохранения";
  if (!startedAt) return "";
  if (ended && savedEndedAt) {
    return `слились: ${formatDateRange(startedAt, savedEndedAt)}`;
  }
  if (ended) return "счётчик остановится при сохранении";
  return `вар идёт с ${formatStartDate(startedAt)}`;
}
