import { EditLogFields } from "~/types/types";
import { Column } from "~/types/interfaces";
import dayjs from "dayjs";

export const operatorEditColumns = (): Column<EditLogFields>[] => [
  {
    key: "EditedByName",
    label: "Edited By",
    sortable: true,
    filterable: true,
    filterKey: "EditedBy",
    render: (log: EditLogFields) =>
      log.EditedByName ? log.EditedByName : "Unknown Editor",
  },
  {
    key: "CreatedAt",
    label: "Time Edited",
    sortable: true,
    filterable: true,
    filterKey: "CreatedAt",
    render: (log: EditLogFields) =>
      log.CreatedAt
        ? dayjs(log.CreatedAt).format("YYYY/MM/DD HH:mm:ss")
        : "",
  },
  {
    key: "OldValue",
    label: "Previous Value",
    sortable: false,
    filterable: false,
  },
  {
    key: "NewValue",
    label: "New Value",
    sortable: false,
    filterable: false,
  },
  {
    key: "Remarks",
    label: "Remarks",
    sortable: false,
    filterable: false,
  },
];
