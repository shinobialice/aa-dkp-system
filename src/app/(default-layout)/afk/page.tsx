import sql from "@/shared/lib/db";
import type { UserRow, UserTagsRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import AfkMembersTable from "@/widgets/AfkMembersTable";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";

type AfkUser = Pick<
  UserRow,
  | "id"
  | "username"
  | "avatar_url"
  | "vk_name"
  | "class"
  | "class_gear_score"
  | "joined_at"
  | "active"
  | "is_eligible_for_salary"
  | "probation_bypass"
>;

type InactiveRow = AfkUser & Pick<UserRow, "inactive_since">;

type AfkTagRow = AfkUser & Pick<UserTagsRow, "created_at"> & { tag_id: number };

// В АФК-вкладку попадают и неактивные, и с тэгом "АФК"; afk_since берётся
// по более ранней из двух причин.
type MergedAfkUser = AfkUser & {
  afk_since: string | null;
  inactiveSince: string | null;
  tagSince: string | null;
  afkTagId: number | null;
  isInactive: boolean;
  isAfkTagged: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

async function AfkPage() {
  await ensurePrivilieges(["Администратор"]);

  let inactiveRows: InactiveRow[];
  let afkTagRows: AfkTagRow[];
  try {
    [inactiveRows, afkTagRows] = await Promise.all([
      sql<InactiveRow[]>`
        SELECT id, username, avatar_url, vk_name, class, class_gear_score,
               joined_at, active, is_eligible_for_salary, probation_bypass,
               inactive_since
        FROM "user" WHERE active = false
      `,
      sql<AfkTagRow[]>`
        SELECT ut.created_at, ut.id AS tag_id, u.id, u.username, u.avatar_url,
               u.vk_name, u.class, u.class_gear_score, u.joined_at, u.active,
               u.is_eligible_for_salary, u.probation_bypass
        FROM user_tags ut
        JOIN "user" u ON u.id = ut.user_id
        WHERE ut.tag = 'АФК' AND ut.removed_at IS NULL
      `,
    ]);
  } catch (error) {
    console.error("Error loading АФК users:", error);
    return <div>Ошибка загрузки списка АФК-игроков</div>;
  }

  const merged = new Map<number, MergedAfkUser>();

  for (const row of inactiveRows) {
    const { inactive_since, ...user } = row;
    merged.set(user.id, {
      ...user,
      afk_since: inactive_since,
      inactiveSince: inactive_since,
      tagSince: null,
      afkTagId: null,
      isInactive: true,
      isAfkTagged: false,
    });
  }

  for (const row of afkTagRows) {
    const { created_at, tag_id, ...user } = row;
    const existing = merged.get(user.id);
    if (existing) {
      const existingTime = existing.afk_since
        ? new Date(existing.afk_since).getTime()
        : Infinity;
      const tagTime = new Date(created_at).getTime();
      existing.afk_since =
        tagTime < existingTime ? created_at : existing.afk_since;
      existing.isAfkTagged = true;
      existing.tagSince = created_at;
      existing.afkTagId = tag_id;
    } else {
      merged.set(user.id, {
        ...user,
        afk_since: created_at,
        inactiveSince: null,
        tagSince: created_at,
        afkTagId: tag_id,
        isInactive: false,
        isAfkTagged: true,
      });
    }
  }

  const users = Array.from(merged.values()).sort((a, b) => {
    if (!a.afk_since) return -1;
    if (!b.afk_since) return 1;
    return new Date(a.afk_since).getTime() - new Date(b.afk_since).getTime();
  });

  const now = new Date();
  const { month, year } = getMoscowYearMonth(now);

  const [salaries, salaryReasons] = await Promise.all([
    getCurrentMonthSalaries(),
    getSalaryReasons(month, year, users),
  ]);

  const tableData = users.map((user) => {
    const daysInGuild = user.joined_at
      ? Math.floor(
          (now.getTime() - new Date(user.joined_at).getTime()) / DAY_MS,
        )
      : 0;

    return {
      ...user,
      daysInGuild,
      joinedAtFormatted: user.joined_at
        ? new Date(user.joined_at).toLocaleDateString("ru-RU")
        : "-",
      salary: salaries[user.id] ?? null,
      salaryReason: salaryReasons[user.id] ?? null,
    };
  });

  return <AfkMembersTable data={tableData} />;
}

export default AfkPage;
