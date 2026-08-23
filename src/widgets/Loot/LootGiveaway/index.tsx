"use client";

import { useMemo, useState, startTransition } from "react";
import { format } from "date-fns";
import { X, Gift, Wind, Package, Heart } from "lucide-react";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Switch } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { saveGivenAwayLoot } from "@/actions/saveGivenAwayLoot";
import {
  addMiscLootGrant,
  deleteMiscLootGrant,
  type MiscLootGrant,
} from "@/actions/miscLootGrants";
import {
  addWishlistItem,
  deleteWishlistItem,
  type WishlistItem,
} from "@/actions/lootWishlist";

const NONE_STATUS = "__none__";

type LootItem = {
  name: string;
  date: string;
  status: string;
  iconUrl: string | null;
  grade: number | null;
};

type GliderItem = {
  type: string;
  date: string;
  status: string;
  iconUrl: string | null;
  grade: number | null;
};

type Player = {
  id: number;
  username: string;
  active: boolean;
  avatarUrl: string | null;
  loot: LootItem[];
  gliders: GliderItem[];
  miscGrants: MiscLootGrant[];
  wishlist: WishlistItem[];
};

type LootGiveawayProps = {
  initialPlayers: Player[];
  isAdmin: boolean;
};

function avatarSrc(player: Pick<Player, "username" | "avatarUrl">) {
  return (
    player.avatarUrl ??
    `https://api.dicebear.com/6.x/initials/svg?seed=${player.username}`
  );
}

/** Wishlist entries are free text (not tied to the tracked boss/glider
 * list), so they can't be shown as an icon — render as plain text instead. */
function formatWishlistItem(w: WishlistItem) {
  return w.comment ? `${w.itemName} (${w.comment})` : w.itemName;
}

function formatMiscGrant(g: MiscLootGrant) {
  const dateValid = g.date && !isNaN(Date.parse(g.date));
  const amountPart = g.amount != null ? `${g.amount}: ` : "";
  const datePart = dateValid ? ` (${format(new Date(g.date), "dd.MM.yyyy")})` : "";
  return `${amountPart}${g.comment}${datePart}`;
}

/** Small item icon used in the card grid: dimmed when not received, with a
 * colored status dot and a tooltip carrying the full detail. */
function LootStatusIcon({
  name,
  status,
  date,
  iconUrl,
  grade,
}: {
  name: string;
  status: string;
  date: string;
  iconUrl: string | null;
  grade: number | null;
}) {
  const dateValid = date && !isNaN(Date.parse(date));
  const given = status === "Выдано";
  const available = status === "В наличии";
  const wanted = status === "Хочет";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative shrink-0">
          <LootIcon
            itemName={name}
            iconUrl={iconUrl}
            grade={grade}
            size={26}
            className={given || available || wanted ? "" : "opacity-30 grayscale"}
          />
          {given && (
            <span className="border-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 bg-green-600" />
          )}
          {available && (
            <span className="border-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 bg-blue-500" />
          )}
          {wanted && (
            <span className="border-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 bg-pink-500" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {name}
        {given
          ? ` — выдано${dateValid ? ` ${format(new Date(date), "dd.MM.yyyy")}` : ""}`
          : available
            ? " — в наличии"
            : wanted
              ? " — хочет"
              : " — не выдано"}
      </TooltipContent>
    </Tooltip>
  );
}

function PlayerCard({
  player,
  onOpen,
}: {
  player: Player;
  onOpen: () => void;
}) {
  const shownLoot = player.loot.filter((l) => l.status);
  const shownGliders = player.gliders.filter((g) => g.status);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      className="hover:border-primary/50 cursor-pointer gap-3 py-4 transition-colors"
    >
      <CardHeader className="px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={avatarSrc(player)} alt={player.username} />
              <AvatarFallback className="text-xs">
                {player.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium">{player.username}</span>
          </div>
          {!player.active && (
            <Badge
              variant="outline"
              className="text-muted-foreground shrink-0 font-normal"
            >
              неактивен
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex flex-wrap gap-1.5">
          {shownLoot.map((l) => (
            <LootStatusIcon
              key={l.name}
              name={l.name}
              status={l.status}
              date={l.date}
              iconUrl={l.iconUrl}
              grade={l.grade}
            />
          ))}
          {shownGliders.map((g) => (
            <LootStatusIcon
              key={g.type}
              name={g.type}
              status={g.status}
              date={g.date}
              iconUrl={g.iconUrl}
              grade={g.grade}
            />
          ))}
          {shownLoot.length === 0 && shownGliders.length === 0 && (
            <span className="text-muted-foreground text-xs">–</span>
          )}
        </div>
        {player.miscGrants.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <Package className="size-3.5 shrink-0 text-muted-foreground" />
            {player.miscGrants.map((g) => (
              <Badge key={g.id} variant="outline" className="font-normal">
                {formatMiscGrant(g)}
              </Badge>
            ))}
          </div>
        )}
        {player.wishlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <Heart className="size-3.5 shrink-0 text-pink-500" />
            {player.wishlist.map((w) => (
              <Badge key={w.id} variant="outline" className="font-normal">
                {formatWishlistItem(w)}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddMiscGrantForm({
  onAdd,
}: {
  onAdd: (grant: { comment: string; amount: number | null; date: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 cursor-pointer justify-start px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        + добавить
      </Button>
    );
  }

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onAdd({ comment: comment.trim(), amount: amount ? Number(amount) : null, date });
    setComment("");
    setAmount("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 rounded-md border p-2">
      <Input
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-7 text-xs"
      />
      <div className="flex items-center gap-1">
        <Input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-7 w-20 text-xs"
        />
        <input
          type="date"
          className="h-7 flex-1 rounded border px-1 py-0.5 text-xs"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!comment.trim()}
          onClick={handleSubmit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

function AddWishlistForm({
  onAdd,
}: {
  onAdd: (item: { itemName: string; comment: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 cursor-pointer justify-start px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        + добавить
      </Button>
    );
  }

  const handleSubmit = () => {
    if (!itemName.trim()) return;
    onAdd({ itemName: itemName.trim(), comment: comment.trim() });
    setItemName("");
    setComment("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 rounded-md border p-2">
      <Input
        placeholder="Название предмета"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="h-7 text-xs"
      />
      <Input
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-7 text-xs"
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!itemName.trim()}
          onClick={handleSubmit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

export default function LootGiveaway({
  initialPlayers,
  isAdmin,
}: LootGiveawayProps) {
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [showInactive, setShowInactive] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [sheetEditMode, setSheetEditMode] = useState(false);

  const rosterPlayers = useMemo(
    () => allPlayers.filter((p) => p.active || showInactive),
    [allPlayers, showInactive],
  );

  const displayedPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rosterPlayers;
    return rosterPlayers.filter((p) => p.username.toLowerCase().includes(q));
  }, [rosterPlayers, search]);

  const selectedPlayer = useMemo(
    () => allPlayers.find((p) => p.id === selectedPlayerId) ?? null,
    [allPlayers, selectedPlayerId],
  );
  const selectedPlayerIndex = useMemo(
    () => allPlayers.findIndex((p) => p.id === selectedPlayerId),
    [allPlayers, selectedPlayerId],
  );

  const openPlayer = (id: number) => {
    setSelectedPlayerId(id);
    setSheetEditMode(false);
  };

  const updateLoot = (
    playerIndex: number,
    lootIndex: number,
    changes: Partial<LootItem>,
  ) => {
    const updated = [...allPlayers];
    const loot = updated[playerIndex].loot[lootIndex];
    Object.assign(loot, changes);
    setAllPlayers(updated);

    const { name, date, status } = loot;
    const isValidDate = date && !isNaN(Date.parse(date));
    if (status && (status === "Выдано" ? isValidDate : true)) {
      startTransition(() => {
        saveGivenAwayLoot(updated[playerIndex].id, {
          name,
          date: isValidDate ? date : new Date().toISOString().split("T")[0],
          status,
        });
      });
    }
  };

  const updateGlider = (
    playerIndex: number,
    type: string,
    changes: Partial<GliderItem>,
  ) => {
    const updated = [...allPlayers];
    const glider = updated[playerIndex].gliders.find((g) => g.type === type);
    if (!glider) return;
    Object.assign(glider, changes);
    setAllPlayers(updated);

    const { date, status } = glider;
    const isValidDate = date && !isNaN(Date.parse(date));
    if (status && (status === "Выдано" ? isValidDate : true)) {
      startTransition(() => {
        saveGivenAwayLoot(updated[playerIndex].id, {
          name: type,
          date: isValidDate ? date : new Date().toISOString().split("T")[0],
          status,
        });
      });
    }
  };

  const removeGlider = (playerIndex: number, type: string) => {
    const updated = [...allPlayers];
    const glider = updated[playerIndex].gliders.find((g) => g.type === type);
    if (!glider) return;
    glider.date = "";
    glider.status = "";
    setAllPlayers(updated);

    startTransition(() => {
      saveGivenAwayLoot(updated[playerIndex].id, {
        name: type,
        date: new Date().toISOString().split("T")[0],
        status: "",
      });
    });
  };

  const handleAddMiscGrant = async (
    playerIndex: number,
    grant: { comment: string; amount: number | null; date: string },
  ) => {
    const created = await addMiscLootGrant(allPlayers[playerIndex].id, grant);
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      miscGrants: [...updated[playerIndex].miscGrants, created].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    };
    setAllPlayers(updated);
  };

  const handleRemoveMiscGrant = (playerIndex: number, id: number) => {
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      miscGrants: updated[playerIndex].miscGrants.filter((g) => g.id !== id),
    };
    setAllPlayers(updated);

    startTransition(() => {
      deleteMiscLootGrant(id);
    });
  };

  const handleAddWishlistItem = async (
    playerIndex: number,
    item: { itemName: string; comment: string },
  ) => {
    const created = await addWishlistItem(allPlayers[playerIndex].id, item);
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      wishlist: [...updated[playerIndex].wishlist, created],
    };
    setAllPlayers(updated);
  };

  const handleRemoveWishlistItem = (playerIndex: number, id: number) => {
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      wishlist: updated[playerIndex].wishlist.filter((w) => w.id !== id),
    };
    setAllPlayers(updated);

    startTransition(() => {
      deleteWishlistItem(id);
    });
  };

  const renderLootStatus = (
    loot: LootItem,
    isEditMode: boolean,
    playerIndex: number,
    lootIndex: number,
  ) => {
    const dateValid = loot.date && !isNaN(Date.parse(loot.date));

    if (!isEditMode) {
      if (loot.status === "В наличии") {
        return <Badge variant="secondary">В наличии</Badge>;
      }
      if (loot.status === "Хочет") {
        return <Badge className="bg-pink-500">Хочет</Badge>;
      }
      if (loot.status === "Выдано") {
        return (
          <Badge className="bg-green-600">
            Выдано
            {dateValid ? ` · ${format(new Date(loot.date), "dd.MM.yyyy")}` : ""}
          </Badge>
        );
      }
      return <span className="text-muted-foreground text-sm">–</span>;
    }

    return (
      <div className="flex flex-wrap items-center justify-end gap-1">
        <Select
          value={loot.status || NONE_STATUS}
          onValueChange={(value) =>
            updateLoot(playerIndex, lootIndex, {
              status: value === NONE_STATUS ? "" : value,
            })
          }
        >
          <SelectTrigger size="sm" className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_STATUS}>–</SelectItem>
            <SelectItem value="Выдано">Выдано</SelectItem>
            <SelectItem value="В наличии">В наличии</SelectItem>
            <SelectItem value="Хочет">Хочет</SelectItem>
          </SelectContent>
        </Select>
        {loot.status === "Выдано" && (
          <input
            type="date"
            className="h-8 rounded border px-2 text-xs"
            value={loot.date || ""}
            onChange={(e) =>
              updateLoot(playerIndex, lootIndex, { date: e.target.value })
            }
          />
        )}
      </div>
    );
  };

  const renderGliderSection = (
    gliders: GliderItem[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    const given = gliders.filter((g) => g.status);

    if (!isEditMode) {
      if (given.length === 0)
        return <span className="text-muted-foreground text-sm">–</span>;
      return (
        <div className="flex flex-wrap gap-1.5">
          {given.map((g) => {
            const dateValid = g.date && !isNaN(Date.parse(g.date));
            if (g.status === "Выдано") {
              return (
                <Badge key={g.type} className="gap-1 bg-green-600">
                  <LootIcon itemName={g.type} iconUrl={g.iconUrl} grade={g.grade} size={14} />
                  {g.type}
                  {dateValid
                    ? ` · ${format(new Date(g.date), "dd.MM.yyyy")}`
                    : ""}
                </Badge>
              );
            }
            if (g.status === "Хочет") {
              return (
                <Badge key={g.type} className="gap-1 bg-pink-500">
                  <LootIcon itemName={g.type} iconUrl={g.iconUrl} grade={g.grade} size={14} />
                  {g.type}
                </Badge>
              );
            }
            return (
              <Badge key={g.type} variant="secondary" className="gap-1">
                <LootIcon itemName={g.type} iconUrl={g.iconUrl} grade={g.grade} size={14} />
                {g.type}
              </Badge>
            );
          })}
        </div>
      );
    }

    const available = gliders.filter((g) => !g.status);

    return (
      <div className="flex flex-col gap-1.5">
        {given.map((g) => (
          <div
            key={g.type}
            className="flex flex-wrap items-center gap-1.5 rounded-md border p-2"
          >
            <LootIcon itemName={g.type} iconUrl={g.iconUrl} grade={g.grade} size={22} />
            <span className="flex-1 text-xs">{g.type}</span>
            <Select
              value={g.status}
              onValueChange={(value) =>
                updateGlider(playerIndex, g.type, { status: value })
              }
            >
              <SelectTrigger size="sm" className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Выдано">Выдано</SelectItem>
                <SelectItem value="В наличии">В наличии</SelectItem>
                <SelectItem value="Хочет">Хочет</SelectItem>
              </SelectContent>
            </Select>
            {g.status === "Выдано" && (
              <input
                type="date"
                className="h-8 rounded border px-2 text-xs"
                value={g.date}
                onChange={(e) =>
                  updateGlider(playerIndex, g.type, { date: e.target.value })
                }
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground size-7 shrink-0 cursor-pointer"
              onClick={() => removeGlider(playerIndex, g.type)}
            >
              <X />
            </Button>
          </div>
        ))}
        {available.length > 0 && (
          <Select
            value=""
            onValueChange={(value) =>
              updateGlider(playerIndex, value, { status: "Выдано" })
            }
          >
            <SelectTrigger size="sm" className="h-8 w-full text-xs">
              <SelectValue placeholder="+ добавить глайдер" />
            </SelectTrigger>
            <SelectContent>
              {available.map((g) => (
                <SelectItem key={g.type} value={g.type}>
                  {g.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const renderMiscSection = (
    grants: MiscLootGrant[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    if (!isEditMode) {
      if (grants.length === 0)
        return <span className="text-muted-foreground text-sm">–</span>;
      return (
        <div className="flex flex-wrap gap-1.5">
          {grants.map((g) => (
            <Badge key={g.id} variant="outline" className="font-normal">
              {formatMiscGrant(g)}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {grants.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            <span className="flex-1 text-xs">{formatMiscGrant(g)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground size-7 shrink-0 cursor-pointer"
              onClick={() => handleRemoveMiscGrant(playerIndex, g.id)}
            >
              <X />
            </Button>
          </div>
        ))}
        <AddMiscGrantForm
          onAdd={(grant) => handleAddMiscGrant(playerIndex, grant)}
        />
      </div>
    );
  };

  const renderWishlistSection = (
    wishlist: WishlistItem[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    if (!isEditMode) {
      if (wishlist.length === 0)
        return <span className="text-muted-foreground text-sm">–</span>;
      return (
        <div className="flex flex-wrap gap-1.5">
          {wishlist.map((w) => (
            <Badge key={w.id} variant="outline" className="font-normal">
              {formatWishlistItem(w)}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {wishlist.map((w) => (
          <div
            key={w.id}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            <span className="flex-1 text-xs">{formatWishlistItem(w)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground size-7 shrink-0 cursor-pointer"
              onClick={() => handleRemoveWishlistItem(playerIndex, w.id)}
            >
              <X />
            </Button>
          </div>
        ))}
        <AddWishlistForm
          onAdd={(item) => handleAddWishlistItem(playerIndex, item)}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="mb-1 flex items-center gap-2 text-2xl font-bold">
        <Gift className="text-muted-foreground size-6" />
        Раздача лута
      </h2>

      <div className="text-muted-foreground mb-4 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-green-600" />
          выдано
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blue-500" />
          в наличии
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-pink-500" />
          хочет
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          placeholder="поиск по нику..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Switch
            className="cursor-pointer"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <span className="text-muted-foreground text-sm">
            Показать неактивных
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onOpen={() => openPlayer(player.id)}
          />
        ))}
        {displayedPlayers.length === 0 && (
          <div className="text-muted-foreground col-span-full py-12 text-center">
            Никого не найдено
          </div>
        )}
      </div>

      <Sheet
        open={selectedPlayer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPlayerId(null);
        }}
      >
        <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
          {selectedPlayer && (
            <>
              <SheetHeader className="border-b">
                <div className="flex items-center justify-between gap-2">
                  <SheetTitle className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={avatarSrc(selectedPlayer)}
                        alt={selectedPlayer.username}
                      />
                      <AvatarFallback className="text-xs">
                        {selectedPlayer.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedPlayer.username}
                  </SheetTitle>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setSheetEditMode((v) => !v)}
                    >
                      {sheetEditMode ? "Готово" : "Редактировать"}
                    </Button>
                  )}
                </div>
                <SheetDescription>
                  {selectedPlayer.active ? "Активен" : "Неактивен"}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4">
                <section className="flex flex-col gap-2">
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Лут
                  </h3>
                  <div className="flex flex-col gap-2">
                    {selectedPlayer.loot.map((loot, lootIndex) => (
                      <div
                        key={loot.name}
                        className="flex flex-wrap items-center gap-2 rounded-md border p-2"
                      >
                        <LootIcon
                          itemName={loot.name}
                          iconUrl={loot.iconUrl}
                          grade={loot.grade}
                          size={28}
                        />
                        <span className="flex-1 text-sm">{loot.name}</span>
                        {renderLootStatus(
                          loot,
                          sheetEditMode,
                          selectedPlayerIndex,
                          lootIndex,
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="flex flex-col gap-2">
                  <h3 className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                    <Wind className="size-4" />
                    Глайдер
                  </h3>
                  {renderGliderSection(
                    selectedPlayer.gliders,
                    sheetEditMode,
                    selectedPlayerIndex,
                  )}
                </section>

                <section className="flex flex-col gap-2">
                  <h3 className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                    <Package className="size-4" />
                    Прочее
                  </h3>
                  {renderMiscSection(
                    selectedPlayer.miscGrants,
                    sheetEditMode,
                    selectedPlayerIndex,
                  )}
                </section>

                <section className="flex flex-col gap-2">
                  <h3 className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                    <Heart className="size-4" />
                    Хочет
                  </h3>
                  {renderWishlistSection(
                    selectedPlayer.wishlist,
                    sheetEditMode,
                    selectedPlayerIndex,
                  )}
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
