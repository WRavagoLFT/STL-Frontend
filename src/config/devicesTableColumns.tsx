import dayjs from "dayjs";
import { Column } from "~/types/interfaces";
import { Device } from "~/types/types";

export const devicesTableColumns = (): Column<Device>[] => [
//   {
//     key: "DeviceId",
//     label: "Device ID",
//     sortable: true,
//     filterable: false,
//   },
  {
    key: "AssignmentDate",
    label: "Assigned On",
    sortable: true,
    filterable: true,
    render: (row) => dayjs(row.AssignmentDate).format("YYYY/MM/DD"),
  },
  {
    key: "IssuedBy",
    label: "Issued By",
    sortable: true,
    filterable: true,
  },
  {
    key: "UsageNotes",
    label: "Usage Notes",
    sortable: false,
    filterable: true,
  },
  {
    key: "SIMNumber",
    label: "SIM Number",
    sortable: false,
    filterable: true,
  },
  {
    key: "TelcoProvider",
    label: "Telco",
    sortable: true,
    filterable: true,
  },
  {
    key: "DataPlan",
    label: "Data Plan",
    sortable: false,
    filterable: true,
  },
  {
    key: "LastSyncTimestamp",
    label: "Last Sync",
    sortable: true,
    filterable: false,
    render: (row) => dayjs(row.LastSyncTimestamp).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    key: "LastLoginTime",
    label: "Last Login",
    sortable: true,
    filterable: false,
    render: (row) => dayjs(row.LastLoginTime).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    key: "DeviceStatus",
    label: "Status",
    sortable: true,
    filterable: true,
  }
];
