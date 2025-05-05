export type LootItem = {
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

export interface NewLootItem {
  itemTypeId: number;
  source: string;
  acquired_at: string;
  quantity: number;
  itemName: string;
}
