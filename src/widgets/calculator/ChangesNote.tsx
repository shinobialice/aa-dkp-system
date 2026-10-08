import { Button } from "@/shared/ui";
import { changesText, isModified } from "./buildChanges";
import type { TrackedBuild } from "./calculatorModel";

type Props = {
  build: TrackedBuild;
  onReset: () => void;
  onCompareWithOriginal?: () => void;
};

export default function ChangesNote({
  build,
  onReset,
  onCompareWithOriginal,
}: Props) {
  if (!isModified(build)) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
        <span className="size-2 rounded-full bg-amber-500" />
        {changesText(build)}
      </span>
      <Button
        variant="link"
        size="sm"
        className="h-auto cursor-pointer p-0"
        onClick={onReset}
      >
        Вернуть как было
      </Button>
      {onCompareWithOriginal && (
        <Button
          variant="link"
          size="sm"
          className="h-auto cursor-pointer p-0"
          onClick={onCompareWithOriginal}
        >
          Сравнить с исходной
        </Button>
      )}
    </div>
  );
}
