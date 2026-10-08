import { useEffect, useState } from "react";
import {
  originalOf,
  trackBuild,
  type CalculatorBuild,
  type TrackedBuild,
} from "./calculatorModel";
import { readStoredState, writeStoredState } from "./calculatorStorage";

export type BuildSide = "doll" | "target";

export type CalculatorState = {
  doll: TrackedBuild;
  target: TrackedBuild | null;
};

export function useCalculator(
  storageKey: string,
  initialState: () => CalculatorState,
) {
  const [state, setState] = useState(
    () => readStoredState(storageKey) ?? initialState(),
  );

  useEffect(() => {
    writeStoredState(storageKey, state);
  }, [storageKey, state]);

  const load = (
    side: BuildSide,
    build: CalculatorBuild,
    savedId: number | null = null,
  ) => {
    setState((current) => withSide(current, side, trackBuild(build, savedId)));
  };

  const update = (side: BuildSide, patch: Partial<CalculatorBuild>) => {
    setState((current) => {
      const tracked = current[side];
      if (!tracked) return current;
      const changed = { ...tracked, current: { ...tracked.current, ...patch } };
      return withSide(current, side, changed);
    });
  };

  const reset = (side: BuildSide) => {
    setState((current) => {
      const tracked = current[side];
      if (!tracked) return current;
      return withSide(current, side, { ...tracked, current: tracked.original });
    });
  };

  const forgetSaved = (savedId: number) => {
    setState((current) => ({
      doll: withoutSaved(current.doll, savedId),
      target: current.target && withoutSaved(current.target, savedId),
    }));
  };

  const compareWithOriginal = () => {
    setState((current) => ({
      ...current,
      target: trackBuild(originalOf(current.doll)),
    }));
  };

  const stopComparing = () => {
    setState((current) => ({ ...current, target: null }));
  };

  const swap = () => {
    setState((current) => {
      if (!current.target) return current;
      return { doll: current.target, target: current.doll };
    });
  };

  return {
    doll: state.doll,
    target: state.target,
    load,
    update,
    reset,
    compareWithOriginal,
    stopComparing,
    swap,
    forgetSaved,
  };
}

function withoutSaved(build: TrackedBuild, savedId: number): TrackedBuild {
  if (build.savedId !== savedId) return build;
  return { ...build, savedId: null };
}

function withSide(
  state: CalculatorState,
  side: BuildSide,
  build: TrackedBuild,
): CalculatorState {
  if (side === "doll") return { ...state, doll: build };
  return { ...state, target: build };
}
