import { readdirSync, readFileSync } from "node:fs";

export const ITEMS_DIR = "src/widgets/profile/equipment/itemsData";

export function readCatalog() {
  const items = new Map();
  for (const file of readdirSync(ITEMS_DIR)) {
    const source = readFileSync(`${ITEMS_DIR}/${file}`, "utf8");
    if (!source.includes(": GearItem[]")) continue;
    for (const match of source.matchAll(/id: (\d+),\s+name: "([^"]+)"/g)) {
      items.set(Number(match[1]), match[2]);
    }
  }
  return [...items].sort(([a], [b]) => a - b);
}
