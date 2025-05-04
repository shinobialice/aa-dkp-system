export type LootQueueEntry = {
  id: number;
  userId: number;
  username: string;
  status: string;
  synthTarget?: string;
  required: number;
  delivered: number;
  createdAt: Date;
};
