export type StaticRow = {
  kind: "static";
  label: string;
  value: string;
  indent?: boolean;
};
export type EngravingRow = {
  kind: "engraving";
  label: string;
  base: number;
  unit: string;
  decimals: number;
  engravingKey: string;
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
export type Row = StaticRow | EngravingRow | ComputedRow;
export type RowGroup = { title?: string; rows: Row[] };

export function staticRow(
  label: string,
  value: string,
  indent?: boolean,
): StaticRow {
  return { kind: "static", label, value, indent };
}

export function engravingRow(
  label: string,
  base: number,
  unit: string,
  decimals: number,
  engravingKey: string,
  indent?: boolean,
): EngravingRow {
  return {
    kind: "engraving",
    label,
    base,
    unit,
    decimals,
    engravingKey,
    indent,
  };
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
