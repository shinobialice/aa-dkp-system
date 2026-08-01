import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import AfkMembersTable from "@/widgets/AfkMembersTable";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";

const AfkPage = async () => {
  await ensurePrivilieges(["Администратор"]);

  type AfkUser = {
    id: number;
    username: string;
    class: string | null;
    class_gear_score: number | null;
    joined_at: string | null;
    active: boolean;
    is_eligible_for_salary: boolean;
  };

  const [inactiveRes, afkTagsRes] = await Promise.all([
    supabase
      .from("user")
      .select(
        "id, username, class, class_gear_score, joined_at, active, is_eligible_for_salary, inactive_since",
      )
      .eq("active", false),
    supabase
      .from("user_tags")
      .select(
        "created_at, user(id, username, class, class_gear_score, joined_at, active, is_eligible_for_salary)",
      )
      .eq("tag", "АФК")
      .is("removed_at", null),
  ]);

  if (inactiveRes.error || !inactiveRes.data || afkTagsRes.error || !afkTagsRes.data) {
    console.error(
      "Error loading АФК users:",
      inactiveRes.error || afkTagsRes.error,
    );
    return <div>Ошибка загрузки списка АФК-игроков</div>;
  }

  // Попадает в АФК-вкладку, если выполнено хотя бы одно: стоит тэг "АФК"
  // ИЛИ человек неактивен (active=false, т.е. ушёл из гильдии). afk_since —
  // самая ранняя из двух причин, чтобы "дней в АФК" отражало первое из событий.
  // isInactive/isAfkTagged — чтобы в таблице показать, из-за чего конкретно
  // человек тут оказался (может быть сразу по обеим причинам).
  type MergedAfkUser = AfkUser & {
    afk_since: string | null;
    isInactive: boolean;
    isAfkTagged: boolean;
  };

  const merged = new Map<number, MergedAfkUser>();

  for (const row of inactiveRes.data) {
    const { inactive_since, ...user } = row;
    merged.set(user.id, {
      ...user,
      afk_since: inactive_since,
      isInactive: true,
      isAfkTagged: false,
    });
  }

  for (const row of afkTagsRes.data) {
    if (!row.user) continue;
    const user = row.user as unknown as AfkUser;
    const existing = merged.get(user.id);
    if (existing) {
      const existingTime = existing.afk_since
        ? new Date(existing.afk_since).getTime()
        : Infinity;
      const tagTime = new Date(row.created_at).getTime();
      existing.afk_since =
        tagTime < existingTime ? row.created_at : existing.afk_since;
      existing.isAfkTagged = true;
    } else {
      merged.set(user.id, {
        ...user,
        afk_since: row.created_at,
        isInactive: false,
        isAfkTagged: true,
      });
    }
  }

  const users = Array.from(merged.values()).sort((a, b) => {
    if (!a.afk_since) return -1;
    if (!b.afk_since) return 1;
    return (
      new Date(a.afk_since).getTime() - new Date(b.afk_since).getTime()
    );
  });

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [salaries, salaryReasons] = await Promise.all([
    getCurrentMonthSalaries(),
    getSalaryReasons(month, year, users),
  ]);

  const tableData = users.map((user) => {
    const daysInGuild = user.joined_at
      ? Math.floor(
          (now.getTime() - new Date(user.joined_at).getTime()) /
            (1000 * 3600 * 24),
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">АФК участники</h1>
      <AfkMembersTable data={tableData} />
    </div>
  );
};

export default AfkPage;
