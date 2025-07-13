import { EditLogFields } from "@/types/types";
import { Column } from "@/types/interfaces";
import dayjs from "dayjs";

export const userEditColumns = (): Column<EditLogFields>[] => [
  {
    key: "EditedByName",
    label: "Edited By",
    sortable: true,
    filterable: true,
    filterKey: "EditedBy",
    render: (log: EditLogFields) => log.EditedBy ? log.EditedBy : "N/A",
  },
  {
    key: "CreatedAt",
    label: "Time Edited",
    sortable: true,
    filterable: true,
    filterKey: "CreatedAt",
    render: (log: EditLogFields) => log.CreatedAt
        ? dayjs(log.CreatedAt).format("YYYY/MM/DD HH:mm:ss")
        : "",
  },
  {
    key: "OldValue",
    label: "Previous Value",
    sortable: true,
    filterable: true,
  },
  {
    key: "NewValue",
    label: "New Value",
    sortable: true,
    filterable: true,
  },
  {
    key: "Remarks",
    label: "Remarks",
    sortable: true,
    filterable: true,
  },
];
