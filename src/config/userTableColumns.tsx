import React from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { getUserStatus } from "@/hooks/dashboarddata";
import { Column } from "@/types/interfaces";
import { UsersItem } from "@/lib/api/users/users.service";

export const userTableColumns = (roleId: number): Column<UsersItem>[] => {
  const columns: Column<UsersItem>[] = [
    {
      key: "fullName",
      label: "Name",
      sortable: true,
      filterable: false,
    },
    {
      key: "DateOfRegistration",
      label: "Creation Date",
      sortable: true,
      filterable: true,
      render: (user: UsersItem) =>
        user.DateOfRegistration
          ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")
          : "",
    },
    {
      key: "CreatedBy",
      label: "Created By",
      sortable: true,
      filterable: true,
      render: (log: UsersItem) => log.CreatedBy ? log.CreatedBy : "No value",
    },
    {
      key: "Status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (user: UsersItem) => {
        const sevenDaysAgo = dayjs().subtract(7, "days");
        const status = getUserStatus(user, sevenDaysAgo);
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

  if (roleId === 1 || roleId === 2) {
    columns.splice(1, 0, {
      key: "AssignedArea",
      label: "Assigned Area / Zone",
      sortable: true,
      filterable: false,
      render: (user) =>
        user?.AssignedArea ?? "No Assigned Area available.",
    });
  }

  // Conditionally insert the column for RoleId === 4
  if (roleId === 4) {
    columns.splice(1, 0, {
      key: "OperatorDetails.OperatorName",
      label: "Company Name",
      sortable: true,
      filterable: false,
      render: (user) =>
        user.OperatorDetails && user.OperatorDetails.OperatorName
          ? user.OperatorDetails.OperatorName
          : "No operator assigned",
    });
  }

  // Conditionally insert the column for RoleId === 5
  // to be adjusted
  if (roleId === 5) {
    columns.splice(1, 0, {
      key: "BranchName",
      label: "PSCO Branch",
      sortable: true,
      filterable: false,
      render: (user) =>
        user?.BranchName ?? "No branch name assigned",
    });
  }

  return columns;
};

