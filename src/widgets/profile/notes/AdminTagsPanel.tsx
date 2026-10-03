import { ShieldCheck } from "lucide-react";
import type { ProfileUser } from "@/actions/getUser";
import type { ProfileTag } from "@/widgets/profile/profileTypes";
import { UserTagsSection } from "./UserTagsSection";

type Props = {
  user: ProfileUser;
  tags: ProfileTag[];
  setTags: (tags: ProfileTag[]) => void;
  setUser: (user: ProfileUser) => void;
  averageGuildGS: number;
};

export default function AdminTagsPanel({
  user,
  tags,
  setTags,
  setUser,
  averageGuildGS,
}: Props) {
  return (
    <section
      aria-label="Теги"
      className="flex flex-col rounded-xl border bg-card"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 sm:px-4.5">
        <h2 className="text-base font-semibold">Теги</h2>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          видно только администрации
        </span>
      </div>
      <div className="px-4 pb-4 sm:px-4.5">
        <UserTagsSection
          user={user}
          tags={tags}
          setTags={setTags}
          setUser={setUser}
          averageGuildGS={averageGuildGS}
          isAdmin
        />
      </div>
    </section>
  );
}
