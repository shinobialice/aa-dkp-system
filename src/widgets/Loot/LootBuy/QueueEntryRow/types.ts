import type { QueueEntry, QueueStatusToggle } from "../lootBuyModel";

export type QueueEntryHandlers = {
  onSold: (entry: QueueEntry) => void;
  onRemove: (entry: QueueEntry) => void;
  onToggleStatus: (entry: QueueEntry, status: QueueStatusToggle) => void;
  onUpdate: (
    entry: QueueEntry,
    patch: {
      roll?: number | null;
      required?: number;
      delivered?: number;
      synth_target?: string;
    },
  ) => void;
};
