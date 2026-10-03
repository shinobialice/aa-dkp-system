import { Heart } from "lucide-react";
import {
  formatMiscGrant,
  formatWishlistItem,
  type Player,
} from "./giveawayModel";

export default function Extras({ player }: { player: Player }) {
  if (player.miscGrants.length === 0 && player.wishlist.length === 0) {
    return null;
  }
  return (
    <span className="flex flex-wrap gap-1 text-xs">
      {player.miscGrants.map((grant) => (
        <span key={grant.id} className="rounded-full border px-2 py-px">
          {formatMiscGrant(grant)}
        </span>
      ))}
      {player.wishlist.map((wish) => (
        <span
          key={wish.id}
          className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2 py-px text-pink-800 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-300"
        >
          <Heart className="size-3 fill-current" />
          {formatWishlistItem(wish)}
        </span>
      ))}
    </span>
  );
}
