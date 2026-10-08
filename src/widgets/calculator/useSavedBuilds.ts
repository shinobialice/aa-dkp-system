import {
  deleteCalculatorBuild,
  getMyCalculatorBuilds,
  saveCalculatorBuild,
  type SavedBuild,
} from "@/actions/calculatorBuilds";
import { useAsyncData } from "@/hooks/useAsyncData";
import { fromSnapshot, toSnapshot } from "./buildSnapshot";
import type { BuildSide, useCalculator } from "./useCalculator";

type Calculator = ReturnType<typeof useCalculator>;

export function useSavedBuilds(calculator: Calculator) {
  const { data, reload } = useAsyncData(
    "calculator-builds",
    getMyCalculatorBuilds,
  );

  const open = (side: BuildSide, saved: SavedBuild) => {
    const build = fromSnapshot(saved.snapshot, data?.owners ?? []);
    calculator.load(side, build, saved.id);
  };

  const save = async (side: BuildSide, name: string, asNew: boolean) => {
    const tracked = calculator[side];
    if (!tracked) return;
    const build = { ...tracked.current, name };
    const savedId = await saveCalculatorBuild(
      asNew ? null : tracked.savedId,
      toSnapshot(build),
    );
    calculator.load(side, build, savedId);
    await reload();
  };

  const remove = async (savedId: number) => {
    await deleteCalculatorBuild(savedId);
    calculator.forgetSaved(savedId);
    await reload();
  };

  return { savedBuilds: data?.builds ?? [], open, save, remove };
}
