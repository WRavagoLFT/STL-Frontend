import dayjs from "dayjs";
import { Column } from "~/types/interfaces";
import { Device } from "~/types/types";
import Button from "@mui/material/Button";
import { getUserStatus } from "~/hooks/dashboarddata";

export const devicesTableColumns = (): Column<Device>[] => [
  {
    key: "IssuedBy",
    label: "Issued By",
    sortable: true,
    filterable: false,
  },
  {
    key: "OperatorName",
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
    filterable: false,
  },
  {
    key: "DeviceId",
    label: "Device Id",
    sortable: true,
    filterable: false,
  },
  {
    key: "DeviceStatus",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (device: Device) => {
      const sevenDaysAgo = dayjs().subtract(7, "days");
      const status = getUserStatus(device, sevenDaysAgo);
      return (
        <Button
          variant="contained"
          sx={{
            cursor: "auto",
            textTransform: "none",
            borderRadius: "12px",
            padding: "2px 13px",
            fontSize: "12px",
            backgroundColor:
              status === "Suspended"
                ? "#FF7A7A"
                : status === "Inactive"
                  ? "#FFA726"
                  : "#046115",
            color: "#ffff",
            "&:hover": {
              backgroundColor:
                status === "Suspended"
                  ? "#F05252"
                  : status === "Inactive"
                    ? "#FFA726"
                    : "#046115",
            },
          }}
        >
          {status}
        </Button>
      );
    },
  },
];
