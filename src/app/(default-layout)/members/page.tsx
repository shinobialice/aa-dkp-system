import supabase from "@/shared/lib/supabase";
import MembersTable from "@/widgets/MembersTable";

const MembersPage = async () => {
  const { data: users, error } = await supabase
    .from("user")
    .select("*")
    .order("joined_at", { ascending: true })
    .order("is_eligible_for_salary", { ascending: false })
    .order("active", { ascending: false });

  if (error || !users) {
    console.error("Error loading users:", error);
    return <div>Ошибка загрузки списка игроков</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Список игроков</h1>
      <MembersTable users={users} />
    </div>
  );
};

export default MembersPage;
