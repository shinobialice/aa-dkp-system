import MembersTable from "@/src/components/MembersTable";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function MembersPage() {
  const users = await prisma.user.findMany({
    orderBy: [
      { active: "desc" },
      { is_eligible_for_salary: "desc" },
      { joined_at: "asc" },
    ],
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Список игроков</h1>
      <MembersTable users={users} />
    </div>
  );
}
