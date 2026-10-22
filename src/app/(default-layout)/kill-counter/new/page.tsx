import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import {
  getAglItems,
  getAglRecord,
  getPendingRecords,
  getPrimeDay,
  getPrimeDays,
  type AglItem,
  type PrimeDay,
} from "@/server/killcountArena";
import KillcountArena from "@/widgets/killcount/arena/KillcountArena";

type Props = {
  searchParams: Promise<{ kind?: string; day?: string; record?: string }>;
};

export default async function KillcountNewPage({ searchParams }: Props) {
  const params = await searchParams;
  const kind = params.kind === "agl" ? "agl" : "prime";
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const canEdit = await hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS);

  const [primeDays, aglItems, pending] = await Promise.all([
    getPrimeDays(),
    getAglItems(),
    canEdit ? getPendingRecords() : [],
  ]);
  const selected =
    kind === "prime"
      ? await selectedPrime(primeDays, params.day)
      : await selectedAgl(aglItems, params.record);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountArena
        kind={kind}
        selected={selected}
        primeDays={primeDays}
        aglItems={aglItems}
        pending={pending}
        canEdit={canEdit}
      />
    </div>
  );
}

async function selectedPrime(days: PrimeDay[], wanted: string | undefined) {
  const day = days.find((item) => item.day === wanted) ?? days[0];
  return day ? getPrimeDay(day.day) : null;
}

async function selectedAgl(items: AglItem[], wanted: string | undefined) {
  const scanned = items.filter((item) => item.record);
  const item = scanned.find((entry) => entry.key === wanted) ?? scanned[0];
  return item?.record ? getAglRecord(item.record.id) : null;
}
