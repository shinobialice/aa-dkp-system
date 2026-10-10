"use server";

import sql from "@/shared/lib/db";
import type { UserInventoryRow, UserRow } from "@/shared/lib/dbTypes";
import { getInventoryStockSettings } from "@/actions/inventoryStockSettings";
import { sortPlayers, type NamedPlayer } from "./playerRef";
import {
  CATALOG_TYPES,
  ITEM_SOURCES,
  NO_MISSING_LABELS,
  PROFILE_INVENTORY_TYPES,
  T1_TO_T2_LABEL,
  type InventoryStockSource,
} from "@/shared/config/inventoryStockItems";

export type InventoryStockStat = {
  label: string;
  count: number;
  iconUrl?: string | null;
  players: NamedPlayer[];
  // Отсутствует у "Бафалка" (см. NO_MISSING_LABELS) — для неё список
  // отсутствующих не показываем.
  missingPlayers?: NamedPlayer[];
};

export type InventoryStockItem = {
  label: string;
  group: string;
};

type PlayerRow = Pick<UserRow, "id" | "username" | "class">;

type InventoryRow = Pick<UserInventoryRow, "user_id" | "quality"> & {
  name: string;
  type: string;
};

export async function getInventoryStockItems(): Promise<InventoryStockItem[]> {
  return ITEM_SOURCES.map(({ label, type }) => ({
    label,
    group: type ?? "Прочее",
  }));
}

export async function getInventoryStock(): Promise<InventoryStockStat[]> {
  const { hiddenLabels } = await getInventoryStockSettings();
  const sources = ITEM_SOURCES.filter(
    (source) => !hiddenLabels.includes(source.label),
  );

  const [inventory, players] = await Promise.all([
    sql<InventoryRow[]>`
      SELECT name, type, quality, user_id FROM user_inventory
      WHERE type = ANY(${PROFILE_INVENTORY_TYPES})
    `.catch((error) => {
      console.error("Ошибка при получении инвентаря гильдии:", error);
      throw new Error("Не удалось загрузить инвентарь гильдии");
    }),
    sql<PlayerRow[]>`
      SELECT id, username, class FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `.catch((error) => {
      console.error("Ошибка при получении пользователей:", error);
      throw new Error("Не удалось загрузить пользователей");
    }),
  ]);

  const roster = createRoster(players);
  const activeInventory = inventory.filter((row) => roster.has(row.user_id));

  const ownersByLabel = new Map(
    sources.map((source) => [
      source.label,
      new Set(
        activeInventory
          .filter((row) => matchesSource(row, source))
          .map((row) => row.user_id),
      ),
    ]),
  );

  const curatedStats = sources.map(({ label }) => {
    const owners = ownersByLabel.get(label) ?? new Set<number>();
    const t2Owners =
      ownersByLabel.get(T1_TO_T2_LABEL[label]) ?? new Set<number>();
    return {
      label,
      count: owners.size,
      players: roster.playersOf([...owners].filter((id) => !t2Owners.has(id))),
      missingPlayers: NO_MISSING_LABELS.has(label)
        ? undefined
        : roster.missingFrom(new Set([...owners, ...t2Owners])),
    };
  });

  const curatedNames = new Set(ITEM_SOURCES.map((source) => source.name));
  const dynamicOwnersByName = new Map<string, Set<number>>();
  for (const row of activeInventory) {
    if (!CATALOG_TYPES.includes(row.type)) continue;
    if (curatedNames.has(row.name) || hiddenLabels.includes(row.name)) continue;
    const owners = dynamicOwnersByName.get(row.name) ?? new Set<number>();
    owners.add(row.user_id);
    dynamicOwnersByName.set(row.name, owners);
  }

  const iconByName = await getCatalogIcons([...dynamicOwnersByName.keys()]);
  const dynamicStats = [...dynamicOwnersByName.entries()]
    .map(([label, owners]) => ({
      label,
      count: owners.size,
      iconUrl: iconByName.get(label) ?? null,
      players: roster.playersOf(owners),
      missingPlayers: roster.missingFrom(owners),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));

  return [...curatedStats, ...dynamicStats];
}

function matchesSource(row: InventoryRow, source: InventoryStockSource) {
  return (
    row.name === source.name &&
    (!source.type || row.type === source.type) &&
    (!source.quality || row.quality === source.quality) &&
    (!source.excludeQuality || row.quality !== source.excludeQuality)
  );
}

function createRoster(players: PlayerRow[]) {
  const playerById = new Map<number, NamedPlayer>(
    players.map((player) => [
      player.id,
      { id: player.id, username: player.username, class: player.class },
    ]),
  );
  const playersOf = (ids: Iterable<number>) =>
    sortPlayers(
      [...ids].flatMap((id) => {
        const player = playerById.get(id);
        return player ? [player] : [];
      }),
    );

  return {
    has: (id: number) => playerById.has(id),
    playersOf,
    missingFrom: (owners: Set<number>) =>
      playersOf([...playerById.keys()].filter((id) => !owners.has(id))),
  };
}

async function getCatalogIcons(names: string[]) {
  if (names.length === 0) return new Map<string, string | null>();
  const rows = await sql<{ name: string; icon_url: string | null }[]>`
    SELECT DISTINCT ON (name) name, icon_url
    FROM (
      SELECT name, icon_url, 1 AS priority FROM item_type WHERE name = ANY(${names})
      UNION ALL
      SELECT name, icon_url, 2 AS priority FROM profile_item_type WHERE name = ANY(${names})
    ) combined
    ORDER BY name, priority
  `.catch(() => []);
  return new Map(rows.map((row) => [row.name, row.icon_url]));
}
