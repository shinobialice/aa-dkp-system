import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { saveGivenAwayLoot } from "@/actions/saveGivenAwayLoot";
import {
  addMiscLootGrant,
  deleteMiscLootGrant,
} from "@/actions/miscLootGrants";
import { addWishlistItem, deleteWishlistItem } from "@/actions/lootWishlist";
import { errorMessage } from "@/shared/lib/errorMessage";
import type { PlayerPanelActions } from "./GiveawayPlayerPanel";
import { todayIso, type Player, type PlayerItem } from "./giveawayModel";

const errorText = (error: unknown) => errorMessage(error, "Попробуйте ещё раз");

export function buildGiveawayActions(
  players: Player[],
  setPlayers: Dispatch<SetStateAction<Player[]>>,
  selected: Player | null,
): PlayerPanelActions | null {
  const updatePlayer = (id: number, update: (player: Player) => Player) =>
    setPlayers((previous) =>
      previous.map((player) => (player.id === id ? update(player) : player)),
    );

  const saveItem = (playerId: number, next: PlayerItem) => {
    const previous = players
      .find((player) => player.id === playerId)
      ?.items.find((item) => item.name === next.name);
    const setItem = (value: PlayerItem) =>
      updatePlayer(playerId, (player) => ({
        ...player,
        items: player.items.map((item) =>
          item.name === value.name ? value : item,
        ),
      }));
    setItem(next);
    saveGivenAwayLoot(playerId, {
      name: next.name,
      date: next.date || todayIso(),
      status: next.status,
    }).catch((error) => {
      if (previous) setItem(previous);
      toast.error("Не удалось сохранить", { description: errorText(error) });
    });
  };

  if (!selected) return null;
  const update = (change: (player: Player) => Player) =>
    updatePlayer(selected.id, change);
  const itemByName = (name: string) =>
    selected.items.find((item) => item.name === name);

  return {
    onStatusChange: (name, status) => {
      const date = itemByName(name)?.date ?? "";
      saveItem(selected.id, {
        name,
        status,
        date: status === "Выдано" ? date || todayIso() : date,
      });
    },
    onDateChange: (name, date) => {
      const current = itemByName(name);
      if (current) saveItem(selected.id, { ...current, date });
    },
    onAddMiscGrant: async (grant) => {
      try {
        const created = await addMiscLootGrant(selected.id, grant);
        update((player) => ({
          ...player,
          miscGrants: [...player.miscGrants, created].sort((a, b) =>
            a.date.localeCompare(b.date),
          ),
        }));
      } catch (error) {
        toast.error("Не удалось добавить", { description: errorText(error) });
      }
    },
    onRemoveMiscGrant: (id) => {
      const before = selected.miscGrants;
      update((player) => ({
        ...player,
        miscGrants: player.miscGrants.filter((grant) => grant.id !== id),
      }));
      deleteMiscLootGrant(id).catch((error) => {
        update((player) => ({ ...player, miscGrants: before }));
        toast.error("Не удалось удалить", { description: errorText(error) });
      });
    },
    onAddWishlistItem: async (item) => {
      try {
        const created = await addWishlistItem(selected.id, item);
        update((player) => ({
          ...player,
          wishlist: [...player.wishlist, created],
        }));
      } catch (error) {
        toast.error("Не удалось добавить", { description: errorText(error) });
      }
    },
    onRemoveWishlistItem: (id) => {
      const before = selected.wishlist;
      update((player) => ({
        ...player,
        wishlist: player.wishlist.filter((wish) => wish.id !== id),
      }));
      deleteWishlistItem(id).catch((error) => {
        update((player) => ({ ...player, wishlist: before }));
        toast.error("Не удалось удалить", { description: errorText(error) });
      });
    },
  };
}
