import type { WarOpponentsState } from "@/actions/warOpponents";
import type { WarPeriodHistoryRow } from "@/actions/warPeriodHistory";

export type OpponentStatus = "active" | "ended" | "periodEnd";

export type OpponentView = {
  key: string;
  name: string;
  startedAt: string | null;
  endedAt: string | null;
  status: OpponentStatus;
};

export function liveOpponents(
  state: WarOpponentsState,
  warStartedAt: string | null,
): OpponentView[] {
  const primary: OpponentView[] = state.primary.name
    ? [
        {
          key: "primary",
          name: state.primary.name,
          startedAt: warStartedAt,
          endedAt: state.primary.endedAt,
          status: state.primary.endedAt ? "ended" : "active",
        },
      ]
    : [];
  const extra = state.opponents.map(
    (opponent): OpponentView => ({
      key: String(opponent.id),
      name: opponent.name,
      startedAt: opponent.startedAt,
      endedAt: opponent.endedAt,
      status: opponent.endedAt ? "ended" : "active",
    }),
  );
  return [...primary, ...extra];
}

export function periodOpponents(period: WarPeriodHistoryRow): OpponentView[] {
  const primary: OpponentView[] = period.opponentGuild
    ? [
        {
          key: "primary",
          name: period.opponentGuild,
          startedAt: period.startedAt,
          endedAt: period.opponentEndedAt ?? period.endedAt,
          status: period.opponentEndedAt ? "ended" : "periodEnd",
        },
      ]
    : [];
  const extra = period.extraOpponents.map(
    (opponent, index): OpponentView => ({
      key: `extra-${index}`,
      name: opponent.name,
      startedAt: opponent.startedAt,
      endedAt: opponent.endedAt ?? period.endedAt,
      status: opponent.endedAt ? "ended" : "periodEnd",
    }),
  );
  return [...primary, ...extra];
}

export function activeOpponentNames(state: WarOpponentsState) {
  return liveOpponents(state, null)
    .filter((opponent) => opponent.status === "active")
    .map((opponent) => opponent.name);
}
