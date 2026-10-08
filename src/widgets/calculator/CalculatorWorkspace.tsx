import { useState } from "react";
import type { CalculatorShare } from "@/actions/calculatorShare";
import type {
  CalculatorPlayer,
  CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import { MIN_CHARACTER_LEVEL } from "@/widgets/profile/equipment/characterLevel";
import { isModified } from "./buildChanges";
import { fromSnapshot } from "./buildSnapshot";
import {
  buildFromRole,
  emptyBuild,
  trackBuild,
  withEquipmentOf,
  type CalculatorBuild,
  type TrackedBuild,
} from "./calculatorModel";
import { storageKeyOf } from "./calculatorStorage";
import CalculatorHeader from "./CalculatorHeader";
import CompareView from "./CompareView";
import DollMenu from "./DollMenu";
import OpenLinkDialog from "./OpenLinkDialog";
import PlayerPickerDialog from "./PlayerPickerDialog";
import SaveBuildDialog from "./SaveBuildDialog";
import ShareDialog from "./ShareDialog";
import SingleView from "./SingleView";
import TargetMenu from "./TargetMenu";
import {
  useCalculator,
  type BuildSide,
  type CalculatorState,
} from "./useCalculator";
import { useSavedBuilds } from "./useSavedBuilds";

type Props = {
  viewer: CalculatorPlayer | null;
  share: CalculatorShare | null;
};

export default function CalculatorWorkspace({ viewer, share }: Props) {
  const calculator = useCalculator(storageKeyOf(share?.id ?? null), () =>
    initialState(viewer, share),
  );
  const [pickerSide, setPickerSide] = useState<BuildSide | null>(null);
  const [linkSide, setLinkSide] = useState<BuildSide | null>(null);
  const [isSharing, setSharing] = useState(false);
  const saved = useSavedBuilds(calculator);
  const { doll, target } = calculator;

  const handleRole = (
    side: BuildSide,
    player: CalculatorPlayer,
    role: CalculatorRole,
  ) => calculator.load(side, buildFromRole(player, role));

  const handlePlayerPick = (
    side: BuildSide,
    build: CalculatorBuild,
    withSettings: boolean,
  ) => {
    const base = side === "doll" ? doll : (target ?? doll);
    const loaded = withSettings ? build : withEquipmentOf(base.current, build);
    calculator.load(side, loaded);
  };

  const dollMenu = (label: string) => (
    <DollMenu
      label={label}
      viewer={viewer}
      savedBuilds={saved.savedBuilds}
      onEmpty={() => calculator.load("doll", emptyBuild(defaultLevel(viewer)))}
      onRole={(player, role) => handleRole("doll", player, role)}
      onPickPlayer={() => setPickerSide("doll")}
      onOpenLink={() => setLinkSide("doll")}
      onSaved={(build) => saved.open("doll", build)}
    />
  );

  const targetMenu = (label: string) => (
    <TargetMenu
      label={label}
      viewer={viewer}
      savedBuilds={saved.savedBuilds}
      canCompareWithOriginal={isModified(doll)}
      onOriginal={calculator.compareWithOriginal}
      onRole={(player, role) => handleRole("target", player, role)}
      onPickPlayer={() => setPickerSide("target")}
      onOpenLink={() => setLinkSide("target")}
      onSaved={(build) => saved.open("target", build)}
    />
  );

  const saveButton = (side: BuildSide, tracked: TrackedBuild) => (
    <SaveBuildDialog
      tracked={tracked}
      onSave={(name, asNew) => saved.save(side, name, asNew)}
      onDelete={saved.remove}
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-5">
      <CalculatorHeader
        share={share}
        isComparing={target !== null}
        onSwap={calculator.swap}
        onShare={() => setSharing(true)}
      />

      {target && (
        <CompareView
          doll={doll}
          target={target}
          dollMenu={dollMenu("Загрузить")}
          targetMenu={targetMenu("Загрузить")}
          dollSave={saveButton("doll", doll)}
          targetSave={saveButton("target", target)}
          onUpdate={calculator.update}
          onReset={calculator.reset}
          onStopComparing={calculator.stopComparing}
        />
      )}
      {!target && (
        <SingleView
          doll={doll}
          dollMenu={dollMenu(doll.current.name)}
          targetMenu={targetMenu("Ни с кем")}
          saveButton={saveButton("doll", doll)}
          onUpdate={(patch) => calculator.update("doll", patch)}
          onReset={() => calculator.reset("doll")}
          onCompareWithOriginal={calculator.compareWithOriginal}
        />
      )}

      <PlayerPickerDialog
        side={pickerSide}
        onClose={() => setPickerSide(null)}
        onPick={handlePlayerPick}
      />
      <OpenLinkDialog
        side={linkSide}
        onClose={() => setLinkSide(null)}
        onPick={calculator.load}
      />
      <ShareDialog
        open={isSharing}
        onOpenChange={setSharing}
        doll={doll.current}
        target={target?.current ?? null}
      />
    </div>
  );
}

function initialState(
  viewer: CalculatorPlayer | null,
  share: CalculatorShare | null,
): CalculatorState {
  if (!share) {
    return { doll: trackBuild(emptyBuild(defaultLevel(viewer))), target: null };
  }
  const [doll, target] = share.snapshot.builds;
  return {
    doll: trackBuild(fromSnapshot(doll, share.owners)),
    target: target ? trackBuild(fromSnapshot(target, share.owners)) : null,
  };
}

function defaultLevel(viewer: CalculatorPlayer | null): number {
  return viewer?.level ?? MIN_CHARACTER_LEVEL;
}
