"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { Input } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { getMembersTableData } from "@/actions/getMembersTableData";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import {
  DESC_FIRST,
  classCounts,
  groupByClass,
  matchesSearch,
  sortMembers,
  type Member,
  type MemberGroup,
  type Sort,
  type SortKey,
} from "./membersModel";
import { MemberRow, ROW_COLUMNS } from "./MemberRow";
import { MemberCard } from "./MemberCard";
import GroupHeader from "./GroupHeader";
import ClassChips, { type ClassChip } from "./ClassChips";

const POLL_MS = 45_000;

const HEADERS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "username", label: "Игрок" },
  { key: "class", label: "Класс" },
  { key: "gs", label: "GS", align: "right" },
  { key: "days", label: "В гильдии" },
  { key: "prime", label: "Прайм" },
  { key: "agl", label: "АГЛ" },
  { key: "total", label: "Итого" },
  { key: "salary", label: "Зарплата", align: "right" },
];

export default function MembersTable({ data }: { data: Member[] }) {
  const [rows, setRows] = useState<Member[]>(data);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>({ key: "class", desc: false });
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollTableToTop = () => tableRef.current?.scrollTo({ top: 0 });

  useVisiblePolling(async () => {
    const fresh = await getMembersTableData();
    if (fresh) setRows(fresh as Member[]);
  }, POLL_MS);

  const counts = useMemo(() => classCounts(rows), [rows]);
  const visible = useMemo(() => {
    const query = search.trim();
    const filtered = rows.filter(
      (member) =>
        matchesSearch(member, query) &&
        (!classFilter || member.class === classFilter),
    );
    return sortMembers(filtered, sort);
  }, [rows, search, classFilter, sort]);

  const groups: MemberGroup[] =
    sort.key === "class"
      ? groupByClass(visible, sort.desc)
      : [{ key: "all", title: "", className: null, members: visible }];
  const grouped = sort.key === "class";
  const month = new Date().toLocaleString("ru-RU", { month: "long" });

  const toggleSort = (key: SortKey) => {
    scrollTableToTop();
    setSort((current) =>
      current.key === key
        ? { key, desc: !current.desc }
        : { key, desc: DESC_FIRST.includes(key) },
    );
  };

  const chips: ClassChip[] = [
    { name: null, label: "Все", count: rows.length },
    ...counts.map((item) => ({
      name: item.name,
      label: item.name,
      count: item.count,
    })),
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Участники</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} активных · посещаемость за {month}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Найти игрока"
            placeholder="Ник или имя ВК"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              scrollTableToTop();
            }}
            className="pl-9"
          />
        </div>
      </div>

      <ClassChips
        chips={chips}
        active={classFilter}
        onChange={(name) => {
          setClassFilter(name);
          scrollTableToTop();
        }}
      />

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Никого не нашлось
        </div>
      ) : (
        <>
          <div
            ref={tableRef}
            className="hidden max-h-[max(24rem,calc(100dvh-12rem))] overflow-y-auto rounded-xl border bg-card [scrollbar-width:thin] xl:block"
          >
            <div
              className={cn(
                "sticky top-0 z-10 grid items-center gap-3 border-b bg-muted px-4 py-2 text-xs font-medium text-muted-foreground",
                ROW_COLUMNS,
              )}
            >
              {HEADERS.map((header) => {
                const active = sort.key === header.key;
                const Arrow = sort.desc ? ArrowDown : ArrowUp;
                return (
                  <button
                    key={header.key}
                    type="button"
                    onClick={() => toggleSort(header.key)}
                    aria-label={
                      active
                        ? `${header.label}, сортировка ${sort.desc ? "по убыванию" : "по возрастанию"}`
                        : `Сортировать: ${header.label}`
                    }
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 hover:text-foreground",
                      header.align === "right" && "justify-end",
                      active && "text-foreground",
                    )}
                  >
                    {header.label}
                    {active && <Arrow className="size-3.5" />}
                  </button>
                );
              })}
            </div>
            {groups.map((group) => (
              <div key={group.key}>
                {grouped && <GroupHeader group={group} />}
                {group.members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-4 xl:hidden">
            {groups.map((group) => (
              <section key={group.key} className="space-y-2.5">
                {grouped && <GroupHeader group={group} />}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-2.5">
                  {group.members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
