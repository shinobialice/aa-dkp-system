import * as v from "valibot";
import { fromSnapshot, ownersOf, toSnapshot } from "./buildSnapshot";
import type { BuildOwner, TrackedBuild } from "./calculatorModel";
import { BUILD_OWNER_SCHEMA, BUILD_SNAPSHOT_SCHEMA } from "./snapshotSchema";
import type { CalculatorState } from "./useCalculator";

const STORAGE_KEY = "build-calculator";

const TRACKED_SCHEMA = v.object({
  current: BUILD_SNAPSHOT_SCHEMA,
  original: BUILD_SNAPSHOT_SCHEMA,
  savedId: v.optional(v.nullable(v.number()), null),
});

const STORED_STATE_SCHEMA = v.object({
  doll: TRACKED_SCHEMA,
  target: v.nullable(TRACKED_SCHEMA),
  owners: v.array(BUILD_OWNER_SCHEMA),
});

type StoredTracked = v.InferOutput<typeof TRACKED_SCHEMA>;

export function storageKeyOf(shareId: string | null): string {
  if (!shareId) return STORAGE_KEY;
  return `${STORAGE_KEY}:${shareId}`;
}

export function readStoredState(key: string): CalculatorState | null {
  const result = v.safeParse(STORED_STATE_SCHEMA, readJson(key));
  if (!result.success) return null;
  const { doll, target, owners } = result.output;
  return {
    doll: restoreTracked(doll, owners),
    target: target ? restoreTracked(target, owners) : null,
  };
}

export function writeStoredState(key: string, state: CalculatorState) {
  const tracked = state.target ? [state.doll, state.target] : [state.doll];
  const stored = {
    doll: storeTracked(state.doll),
    target: state.target ? storeTracked(state.target) : null,
    owners: ownersOf(
      tracked.flatMap((build) => [build.current, build.original]),
    ),
  };
  try {
    window.localStorage.setItem(key, JSON.stringify(stored));
  } catch (error) {
    console.warn("Не удалось запомнить сборку калькулятора:", error);
  }
}

function readJson(key: string): unknown {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeTracked(build: TrackedBuild): StoredTracked {
  return {
    current: toSnapshot(build.current),
    original: toSnapshot(build.original),
    savedId: build.savedId,
  };
}

function restoreTracked(
  stored: StoredTracked,
  owners: BuildOwner[],
): TrackedBuild {
  return {
    current: fromSnapshot(stored.current, owners),
    original: fromSnapshot(stored.original, owners),
    savedId: stored.savedId,
  };
}
