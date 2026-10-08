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
  max?: number;
};
export type ComputedRow = {
  kind: "computed";
  label: string;
  value: number;
  unit: string;
  decimals: number;
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
  indent?: boolean,
): ComputedRow {
  return { kind: "computed", label, value, unit, decimals, indent };
}

export type RowValue = {
  text: string;
  amount: number | null;
  decimals: number;
};

export function rowValue(row: Row, bonuses: Map<string, number>): RowValue {
  if (row.kind === "static") {
    return { text: row.value, amount: null, decimals: 0 };
  }
  if (row.kind === "bonus") {
    const delta = bonuses.get(row.bonusKey) ?? 0;
    const amount = Math.min(row.base + delta, row.max ?? Infinity);
    return {
      text: `${amount.toFixed(row.decimals)}${row.unit}`,
      amount,
      decimals: row.decimals,
    };
  }
  return {
    text: `${row.value.toFixed(row.decimals)}${row.unit}`,
    amount: row.value,
    decimals: row.decimals,
  };
}
