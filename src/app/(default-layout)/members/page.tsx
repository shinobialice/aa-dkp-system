import MembersTable from "@/widgets/MembersTable";
import { getMembersTableData } from "@/actions/getMembersTableData";

const MembersPage = async () => {
  const tableData = await getMembersTableData();

  if (!tableData) {
    return <div>Ошибка загрузки списка игроков</div>;
  }

  return <MembersTable data={tableData} />;
};

export default MembersPage;
