import type { ReactNode } from "react";
import type { KillRow } from "../killcountModel";

export type RowListProps = {
  rows: KillRow[];
  maxKills: number;
  placeOf: (row: KillRow) => number;
  renderEdit: (row: KillRow) => ReactNode;
  isCanEdit: boolean;
};
