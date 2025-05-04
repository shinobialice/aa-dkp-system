export type LootQueueEntry = {
  id: number;
  itemTypeId: number; // 👈 добавьте это
  userId: number;
  username: string;
  status: string;
  synth_target?: string;
  required: number;
  delivered: number;
  createdAt: Date;
};