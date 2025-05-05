export type LootQueueEntry = {
  id: number;
  userId: number;
  username: string;
  status: string;
  synth_target?: string;
  required: number;
  delivered: number;
  createdAt: Date;
  quantity?: number; 
};
