import type { ReactNode } from "react";

export const NUMBER_COLOR = "#f0a020";

const NUMBER_PATTERN =
  /\d+(?:[.,]\d+)?\s?(?:%|единиц(?:ы|у)?|ед\.|метра|метров|метр\b|м\.)?/g;

export function highlightNumbers(text: string) {
  const matches = text.match(NUMBER_PATTERN);
  if (!matches) return text;

  const parts = text.split(NUMBER_PATTERN);
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    nodes.push(part);
    if (i < matches.length) {
      nodes.push(
        <span key={i} style={{ color: NUMBER_COLOR }}>
          {matches[i]}
        </span>,
      );
    }
  });
  return nodes;
}
