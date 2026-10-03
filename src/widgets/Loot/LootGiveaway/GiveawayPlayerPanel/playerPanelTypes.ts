import { type GiveawayStatus } from "../giveawayModel";

export type PlayerPanelActions = {
  onStatusChange: (itemName: string, status: GiveawayStatus) => void;
  onDateChange: (itemName: string, date: string) => void;
  onAddMiscGrant: (grant: {
    comment: string;
    amount: number | null;
    date: string;
  }) => Promise<void>;
  onRemoveMiscGrant: (id: number) => void;
  onAddWishlistItem: (item: {
    itemName: string;
    comment: string;
  }) => Promise<void>;
  onRemoveWishlistItem: (id: number) => void;
};
