import supabase from "@/shared/lib/supabaseAdmin";
import MembersTable from "@/widgets/MembersTable";
import { computeMonthlyAttendanceForUsers } from "@/actions/getAllUsersActivityWithPercent";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";

const MembersPage = async () => {
  const { data: users, error } = await supabase
    .from("user")
    .select(
      "id, username, class, class_gear_score, joined_at, active, is_eligible_for_salary",
    )
    .eq("active", true)
    .order("joined_at", { ascending: true })
    .order("is_eligible_for_salary", { ascending: false });

  if (error || !users) {
    console.error("Error loading users:", error);
    return <div>Ошибка загрузки списка игроков</div>;
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Раньше это считалось на клиенте в MembersTable через useEffect, дергая 3
  // server actions после гидратации (спиннер + лишний круг клиент→сервер), и
  // каждый из них по новой перезапрашивал таблицу user. Теперь список users
  // уже есть здесь и просто передаётся дальше вместо повторных select.
  const [activity, salaries, salaryReasons] = await Promise.all([
    computeMonthlyAttendanceForUsers(users, month, year),
    getCurrentMonthSalaries(),
    getSalaryReasons(month, year, users),
  ]);

  const tableData = users.map((user) => {
    const act = activity[user.id] ?? {
      primePercent: 0,
      aglPercent: 0,
      totalPercent: 0,
    };

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
      ...act,
    };
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Список игроков</h1>
      <MembersTable data={tableData} />
    </div>
  );
};

export default MembersPage;
