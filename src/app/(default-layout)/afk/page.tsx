import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import AfkMembersTable from "@/widgets/AfkMembersTable";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";

const AfkPage = async () => {
  await ensurePrivilieges(["Администратор"]);

  const { data: afkTags, error } = await supabase
    .from("user_tags")
    .select(
      "created_at, user(id, username, class, class_gear_score, joined_at, active, is_eligible_for_salary)",
    )
    .eq("tag", "АФК")
    .is("removed_at", null)
    .order("created_at", { ascending: true });

  if (error || !afkTags) {
    console.error("Error loading АФК users:", error);
    return <div>Ошибка загрузки списка АФК-игроков</div>;
  }

  type AfkUser = {
    id: number;
    username: string;
    class: string | null;
    class_gear_score: number | null;
    joined_at: string | null;
    active: boolean;
    is_eligible_for_salary: boolean;
  };

  const users = afkTags
    .filter((row) => row.user)
    .map((row) => ({
      ...(row.user as unknown as AfkUser),
      afk_since: row.created_at,
    }));

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
