import type { SlotDraft } from "./slotDraft";
import type { SlotOptions } from "./slotOptions";

export type FieldProps = {
  slotKey: string;
  draft: SlotDraft;
  options: SlotOptions;
  onChange: (patch: Partial<SlotDraft>) => void;
};
