import type { ReactNode } from "react";

type Props = {
  main: ReactNode;
  side: ReactNode;
};

export default function DashboardColumns({ main, side }: Props) {
  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">{main}</div>
      <div className="grid min-w-0 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
        {side}
      </div>
    </div>
  );
}
