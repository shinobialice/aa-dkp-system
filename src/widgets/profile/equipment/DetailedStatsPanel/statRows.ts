export type StaticRow = {
  kind: "static";
  label: string;
  value: string;
  indent?: boolean;
};
export type BonusRow = {
  kind: "bonus";
  label: string;
  base: number;
  unit: string;
  decimals: number;
  bonusKey: string;
  indent?: boolean;
};
export type ComputedRow = {
  kind: "computed";
  label: string;
  value: number;
  unit: string;
  decimals: number;
  boosted: boolean;
  indent?: boolean;
};
export type Row = StaticRow | BonusRow | ComputedRow;
export type RowGroup = { title?: string; rows: Row[] };

export function staticRow(
  label: string,
  value: string,
  indent?: boolean,
): StaticRow {
  return { kind: "static", label, value, indent };
}

export function bonusRow(
  label: string,
  base: number,
  unit: string,
  decimals: number,
  bonusKey: string,
  indent?: boolean,
): BonusRow {
  return { kind: "bonus", label, base, unit, decimals, bonusKey, indent };
}

export function computedRow(
  label: string,
  value: number,
  unit: string,
  decimals: number,
  boosted: boolean,
  indent?: boolean,
): ComputedRow {
  return { kind: "computed", label, value, unit, decimals, boosted, indent };
}
