export type Member = {
  id: number;
  username: string;
  avatar_url: string | null;
  class: string | null;
  class_gear_score: number | null;
  joined_at: string | Date | null;
  daysInGuild: number;
  joinedAtFormatted: string;
  salary: number | null;
  salaryReason: string | null;
  vk_name: string | null;
  vk_id: string | null;
  vk_real_name: string | null;
  primePercent: number | null;
  aglPercent: number | null;
  totalPercent: number | null;
};

export type SortKey =
  | "class"
  | "username"
  | "gs"
  | "days"
  | "prime"
  | "agl"
  | "total"
  | "salary";

export type Sort = { key: SortKey; desc: boolean };

export type MemberGroup = {
  key: string;
  title: string;
  className: string | null;
  members: Member[];
};

export const CLASS_ORDER = [
  "Бард",
  "Лук",
  "Стрелок",
  "Маг",
  "Милик",
  "Тактик",
  "Танцор",
  "Хил",
];

const CLASS_PLURAL: Record<string, string> = {
  Бард: "Барды",
  Лук: "Луки",
  Стрелок: "Стрелки",
  Маг: "Маги",
  Милик: "Милики",
  Тактик: "Тактики",
  Танцор: "Танцоры",
  Хил: "Хилы",
};

export const DESC_FIRST: SortKey[] = [
  "gs",
  "days",
  "prime",
  "agl",
  "total",
  "salary",
];

function classRank(cls: string | null) {
  const index = cls ? CLASS_ORDER.indexOf(cls) : -1;
  return index === -1 ? CLASS_ORDER.length : index;
}

function value(member: Member, key: SortKey): number | string {
  switch (key) {
    case "username":
      return member.username.toLowerCase();
    case "gs":
      return member.class_gear_score ?? -1;
    case "days":
      return member.daysInGuild;
    case "prime":
      return member.primePercent ?? 0;
    case "agl":
      return member.aglPercent ?? 0;
    case "total":
      return member.totalPercent ?? 0;
    case "salary":
      return member.salary ?? -1;
    default:
      return classRank(member.class);
  }
}

export function matchesSearch(member: Member, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    member.username.toLowerCase().includes(q) ||
    (member.vk_real_name ?? "").toLowerCase().includes(q)
  );
}

export function sortMembers(members: Member[], sort: Sort) {
  const direction = sort.desc ? -1 : 1;
  return [...members].sort((a, b) => {
    const left = value(a, sort.key);
    const right = value(b, sort.key);
    if (left === right) return 0;
    if (typeof left === "string" && typeof right === "string") {
      return left.localeCompare(right, "ru") * direction;
    }
    return (left < right ? -1 : 1) * direction;
  });
}

export function groupByClass(members: Member[], desc: boolean): MemberGroup[] {
  const groups = new Map<string, MemberGroup>();
  for (const member of members) {
    const key = member.class ?? "";
    let group = groups.get(key);
    if (!group) {
      group = {
        key: key || "none",
        title: member.class
          ? (CLASS_PLURAL[member.class] ?? member.class)
          : "Без класса",
        className: member.class,
        members: [],
      };
      groups.set(key, group);
    }
    group.members.push(member);
  }
  const ordered = [...groups.values()].sort(
    (a, b) => classRank(a.className) - classRank(b.className),
  );
  return desc ? ordered.reverse() : ordered;
}

export function classCounts(members: Member[]) {
  const counts = new Map<string, number>();
  for (const member of members) {
    if (!member.class) continue;
    counts.set(member.class, (counts.get(member.class) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || classRank(a.name) - classRank(b.name));
}
