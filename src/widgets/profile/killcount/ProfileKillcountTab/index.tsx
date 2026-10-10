"use client";

import {
  getUserKillcountHistory,
  type UserKillcountHistory,
} from "@/actions/getUserKillcountHistory";
import { useAsyncData } from "@/hooks/useAsyncData";
import KillcountOverview from "./KillcountOverview";

type Props = {
  userId: number;
};

export default function ProfileKillcountTab({ userId }: Props) {
  const { data, error } = useAsyncData(`killcount-${userId}`, () =>
    getUserKillcountHistory(userId),
  );

  return (
    <section
      aria-label="Киллкаунт"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <TabContent history={data} hasError={error !== undefined} />
    </section>
  );
}

function TabContent({
  history,
  hasError,
}: {
  history: UserKillcountHistory | undefined;
  hasError: boolean;
}) {
  if (hasError) {
    return <Placeholder>Не удалось загрузить киллкаунт</Placeholder>;
  }
  if (!history) return <Placeholder>Загрузка…</Placeholder>;
  return <KillcountOverview history={history} />;
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
