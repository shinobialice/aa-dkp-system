"use client";
import { useSyncExternalStore } from "react";
import type { CalculatorShare } from "@/actions/calculatorShare";
import type { CalculatorPlayer } from "@/actions/getCalculatorPlayer";
import { Skeleton } from "@/shared/ui";
import CalculatorWorkspace from "./CalculatorWorkspace";

type Props = {
  viewer: CalculatorPlayer | null;
  share: CalculatorShare | null;
};

// Собранная кукла хранится в браузере, поэтому калькулятор рисуется только
// там: разметка с сервера не знает о ней и разошлась бы при гидратации.
export default function Calculator({ viewer, share }: Props) {
  const isBrowser = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  if (!isBrowser) return <CalculatorSkeleton />;
  return <CalculatorWorkspace viewer={viewer} share={share} />;
}

function CalculatorSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex w-full max-w-[96rem] flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-160 rounded-xl" />
    </div>
  );
}

function subscribeToNothing() {
  return () => {};
}
