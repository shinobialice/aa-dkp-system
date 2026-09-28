"use client";
import { Button, DataTable, Input, Typography } from "@/shared/ui";
import { DB_GetKillCountDto, KillCount } from "@/widgets/killcount/types";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Edit3Icon, PlusIcon } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { KillCountEditModal } from "../killcount-edit-modal";
import { updateKillCountById } from "../../api/history";

interface KillCountTableProps {
  data: KillCount[] | DB_GetKillCountDto[];
  /**
   * true, если это история
   */
  isHistory?: boolean;
  /**
   * true, если пользователь может редактировать
   */
  isCanEdit: boolean;
}

const columnHelper = createColumnHelper<KillCount | DB_GetKillCountDto>();

export const KillCountTable: FC<KillCountTableProps> = ({
  data,
  isHistory,
  isCanEdit,
}) => {
  const [tableData, setTableData] = useState<
    KillCount[] | DB_GetKillCountDto[]
  >([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [rowToEdit, setRowToEdit] = useState<KillCount | DB_GetKillCountDto>();
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [search, setSearch] = useState("");

  const handleResetEditValue = () => {
    setRowToEdit(undefined);
  };

  const handleRowEditClick = (row: KillCount | DB_GetKillCountDto) => {
    setRowToEdit(row);
    setIsDialogVisible(true);
  };

  const handleSubmit = async (value: KillCount) => {
    if (isHistory) {
      await updateKillCountById(value);

      return;
    }

    if (!rowToEdit) {
      setTableData((prev) => [...prev, value]);

      return;
    }

    setTableData((prev) => {
      return prev.map((item) => {
        return item.id === rowToEdit.id
          ? {
              ...item,
              ...value,
            }
          : item;
      });
    });
  };

  const handleAddClick = () => {
    setRowToEdit(undefined);
    setIsDialogVisible(true);
  };

  const columns = [
    columnHelper.accessor("userName", {
      header: "Никнейм",
      cell: (info) => {
        const userName = info.getValue();

        const comment = info.row.original?.comment;

        if (!comment) {
          return userName;
        }

        return `${userName} (${comment})`;
      },
    }),
    columnHelper.accessor("playerClass", { header: "Класс" }),
    columnHelper.accessor("startHonor", { header: "Хонора в начале" }),
    columnHelper.accessor("endHonor", { header: "Хонора в конце" }),
    columnHelper.accessor("startKills", { header: "Килов в начале" }),
    columnHelper.accessor("endKills", { header: "Килов в конце" }),
    columnHelper.accessor((row) => row.endHonor - row.startHonor, {
      id: "totalHonor",
      header: "Всего хонора",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.endKills - row.startKills, {
      id: "totalKills",
      header: "Всего килов",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        if (!isCanEdit) {
          return null;
        }

        return (
          <>
            <Button
              variant="ghost"
              aria-label="Изменить строку"
              onClick={() => handleRowEditClick(info.row.original)}
            >
              <Edit3Icon size={12} />
            </Button>
          </>
        );
      },
      maxSize: 24,
      size: 24,
      minSize: 24,
    }),
  ];

  const filteredData = useMemo(() => {
    if (!search) {
      return tableData;
    }

    return tableData.filter((item) =>
      item.userName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tableData, search]);

  return (
    <>
      <div className="flex justify-between mb-4 w-full">
        <Input
          className="w-sm"
          name="killCountSearch"
          onChange={(e) => setSearch(e.target.value.trim())}
          value={search}
          placeholder="Никнейм"
        />
        {!isHistory && isCanEdit && (
          <Button className="flex gap-2" onClick={handleAddClick}>
            Добавить
            <PlusIcon />
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={filteredData} />
      <Typography>
        Всего:{" "}
        {tableData.reduce(
          (acc, item) => (acc += item.endKills - item.startKills),
          0,
        )}
      </Typography>
      <KillCountEditModal
        isVisible={isDialogVisible}
        setIsVisible={setIsDialogVisible}
        resetEditValue={handleResetEditValue}
        onSubmit={handleSubmit}
        rowToEdit={rowToEdit}
      />
    </>
  );
};
