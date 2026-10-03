"use client";

import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/ui";
import type { MiscLootGrant } from "@/actions/miscLootGrants";
import type { WishlistItem } from "@/actions/lootWishlist";
import { LootIcon } from "../../LootBuy/icons/LootIconComponent";
import { GiveawayStatusIcon } from "../GiveawayStatusIcon";
import {
  formatDate,
  formatWishlistItem,
  type Player,
  type TrackedItem,
} from "../giveawayModel";
import { avatarSrc } from "@/shared/lib/format";
import StatusSegments from "./StatusSegments";
import StatusBadge from "./StatusBadge";
import AddMiscGrantForm from "./AddMiscGrantForm";
import AddWishlistForm from "./AddWishlistForm";
import Section from "./PanelSection";
import RemoveButton from "./RemoveButton";
import { type PlayerPanelActions } from "./playerPanelTypes";

export type { PlayerPanelActions } from "./playerPanelTypes";

export default function GiveawayPlayerPanel({
  player,
  items,
  isAdmin,
  editMode,
  onToggleEdit,
  inSheet = false,
  actions,
}: {
  player: Player;
  items: TrackedItem[];
  isAdmin: boolean;
  editMode: boolean;
  onToggleEdit: () => void;
  inSheet?: boolean;
  actions: PlayerPanelActions;
}) {
  const givenCount = player.items.filter((i) => i.status === "Выдано").length;

  const itemRow = (item: TrackedItem, index: number) => {
    const entry = player.items[index];
    return (
      <div
        key={item.name}
        className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-lg border p-2"
      >
        {entry.status ? (
          <GiveawayStatusIcon
            item={item}
            status={entry.status}
            date={entry.date}
            size={28}
            tooltip={false}
          />
        ) : (
          <LootIcon
            itemName={item.name}
            iconUrl={item.iconUrl}
            grade={item.grade}
            size={28}
          />
        )}
        <span className="min-w-28 flex-1 text-sm leading-tight">
          {item.name}
        </span>
        {editMode ? (
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusSegments
              value={entry.status}
              onChange={(status) => actions.onStatusChange(item.name, status)}
            />
            {entry.status === "Выдано" && (
              <input
                type="date"
                aria-label={`Дата выдачи: ${item.name}`}
                className="h-7 rounded-md border bg-background px-1.5 text-xs"
                value={entry.date}
                onChange={(e) =>
                  e.target.value &&
                  actions.onDateChange(item.name, e.target.value)
                }
              />
            )}
          </span>
        ) : (
          <StatusBadge status={entry.status} date={entry.date} />
        )}
      </div>
    );
  };

  const indexed = items.map((item, index) => ({ item, index }));
  const lootRows = indexed.filter(({ item }) => item.kind === "loot");
  const gliderRows = indexed.filter(({ item }) => item.kind === "glider");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-3.5",
          inSheet && "pr-12",
        )}
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={avatarSrc(player.username, player.avatarUrl)}
            alt=""
          />
          <AvatarFallback>{player.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold">
            {player.username}
          </h2>
          <p className="text-xs text-muted-foreground">
            {player.active ? "Активен" : "Неактивен"} · гильдия выдала{" "}
            {givenCount} из {items.length}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={onToggleEdit}
          >
            {editMode ? "Готово" : "Редактировать"}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-3.5 pb-5">
        <Section title="Лут">
          {lootRows.map(({ item, index }) => itemRow(item, index))}
        </Section>
        <Section title="Глайдеры">
          {gliderRows.map(({ item, index }) => itemRow(item, index))}
        </Section>

        <Section title="Прочее">
          {player.miscGrants.length === 0 && !editMode && (
            <span className="text-sm text-muted-foreground">Ничего</span>
          )}
          {player.miscGrants.map((grant: MiscLootGrant) => (
            <div
              key={grant.id}
              className="flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm"
            >
              {grant.amount != null && (
                <span className="font-mono text-xs text-muted-foreground">
                  {grant.amount}
                </span>
              )}
              <span className="min-w-0 flex-1">{grant.comment}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(grant.date)}
              </span>
              {editMode && (
                <RemoveButton
                  onClick={() => actions.onRemoveMiscGrant(grant.id)}
                />
              )}
            </div>
          ))}
          {editMode && <AddMiscGrantForm onAdd={actions.onAddMiscGrant} />}
        </Section>

        <Section title="Хочет">
          {player.wishlist.length === 0 && !editMode && (
            <span className="text-sm text-muted-foreground">Ничего</span>
          )}
          {player.wishlist.map((wish: WishlistItem) => (
            <div
              key={wish.id}
              className="flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm"
            >
              <Heart className="size-3.5 shrink-0 fill-current text-pink-500" />
              <span className="min-w-0 flex-1">{formatWishlistItem(wish)}</span>
              {editMode && (
                <RemoveButton
                  onClick={() => actions.onRemoveWishlistItem(wish.id)}
                />
              )}
            </div>
          ))}
          {editMode && <AddWishlistForm onAdd={actions.onAddWishlistItem} />}
        </Section>
      </div>
    </div>
  );
}
