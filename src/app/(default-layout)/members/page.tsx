import MembersTable from "@/widgets/MembersTable";
import { getMembersTableData } from "@/actions/getMembersTableData";

const MembersPage = async () => {
  const tableData = await getMembersTableData();

  if (!tableData) {
    return <div>Ошибка загрузки списка игроков</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Список игроков</h1>
      <MembersTable data={tableData} />
    </div>
  );
};

export default MembersPage;
