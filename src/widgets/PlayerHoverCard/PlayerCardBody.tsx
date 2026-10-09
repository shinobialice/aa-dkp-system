"use client";
import { getPlayerCard } from "@/actions/getPlayerCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Skeleton } from "@/shared/ui";
import PlayerCardView from "./PlayerCardView";

type Props = {
  userId: number;
};

export default function PlayerCardBody({ userId }: Props) {
  const { data: player, error } = useAsyncData(`player-card-${userId}`, () =>
    getPlayerCard(userId),
  );

  if (error) {
    return (
      <p className="p-4 text-sm text-destructive">
        {errorMessage(error, "Не удалось загрузить игрока")}
      </p>
    );
  }
  if (!player) return <Skeleton className="h-44 w-full rounded-none" />;
  return <PlayerCardView player={player} />;
}
