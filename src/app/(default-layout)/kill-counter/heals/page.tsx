import { notFound } from "next/navigation";
import { getSessionUserId } from "@/actions/getSessionUserId";
import {
  canSeeHealcount,
  getHealcountEntry,
  getHealcountRecords,
} from "@/server/healcount";
import Healcount from "@/widgets/healcount";
import { selectRecord } from "@/widgets/healcount/healcountModel";

type Props = {
  searchParams: Promise<{ record?: string }>;
};

export default async function HealcountPage({ searchParams }: Props) {
  if (!canSeeHealcount(await getSessionUserId())) notFound();

  const params = await searchParams;
  const records = await getHealcountRecords();
  const record = selectRecord(records, params.record);
  const selected = record ? await getHealcountEntry(record) : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Хилкаунт</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Хилы по записям сканера: праймы и АГЛ
        </p>
      </div>
      <Healcount records={records} selected={selected} />
    </div>
  );
}
