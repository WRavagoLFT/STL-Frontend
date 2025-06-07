import dayjs from "dayjs";
import { Column } from "~/types/interfaces";
import { Device } from "~/types/types";

export const devicesTableColumns = (): Column<Device>[] => [
  {
    key: "IssuedBy",
    label: "Issued By",
    sortable: true,
    filterable: true,
  },
  {
    key: "UsageNotes",
    label: "Assigned AAC",
    sortable: true,
    filterable: true,
  },
  {
    key: "AssignmentDate",
    label: "Assigned Date",
    sortable: true,
    filterable: true,
    render: (row) => dayjs(row.AssignmentDate).format("YYYY/MM/DD"),
  },
  {
    key: "AssignedUser",
    label: "Assigned User",
    sortable: true,
    filterable: true,
  },
  {
    key: "DeviceId",
    label: "Device Id",
    sortable: true,
    filterable: true,
  },
  {
    key: "DeviceStatus",
    label: "Status",
    sortable: true,
    filterable: true,
  },
];
