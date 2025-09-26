export type LootItem = {
  sold_to_user_id?: number | null;
  id: number;
  status: string | null;
  source: string | null;
  created_at: Date;
  itemTypeId: number;
  sold_at: Date | null;
  sold_to: string | null;
  comment: string | null;
  acquired_at: Date | null;
  quantity?: number;
  price: number | null;
  itemType: {
    id: number;
    name: string;
    price: number | null;
  };
};

export type GroupedLootItem = {
  id: number;
  itemTypeId: number;
  name: string;
  price: number | null;
  source: string | null;
  acquired_at: Date | null;
  total: number;
  sold: number;
  latest_sold_at: Date | null;
  sold_to: Set<string>;
  comments: Set<string>;
  status: string;
};

export type ItemType = { id: number; name: string };

export type NewLootItem = {
  itemTypeId: number;
  source: string;
  acquired_at: string;
  quantity: number;
  itemName: string;
  status?: string;
  sold_at?: string;
};
