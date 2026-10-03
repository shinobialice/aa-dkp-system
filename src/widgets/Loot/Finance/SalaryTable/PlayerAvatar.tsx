import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import type { SalaryEntry } from "../financeModel";

type Props = {
  row: SalaryEntry;
};

export default function PlayerAvatar({ row }: Props) {
  return (
    <Avatar className="size-8 shrink-0">
      <AvatarImage src={avatarSrc(row.username, row.avatarUrl)} alt="" />
      <AvatarFallback className="text-2xs font-semibold">
        {row.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
