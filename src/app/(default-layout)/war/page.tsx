import Image from "next/image";
import { getGuildStatus } from "@/actions/guildStatusSettings";

const MODE_LABEL = {
  freeshard: "Фришка",
  pvp: "ПВП",
} as const;

const MODE_ICON = {
  freeshard: "/images/nation/friendship.png",
  pvp: "/images/nation/hostile.png",
} as const;

export default async function WarPage() {
  const { mode } = await getGuildStatus();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <Image
        src={MODE_ICON[mode]}
        alt={MODE_LABEL[mode]}
        width={160}
        height={160}
      />
      <h1 className="text-2xl font-bold">{MODE_LABEL[mode]}</h1>
    </div>
  );
}
