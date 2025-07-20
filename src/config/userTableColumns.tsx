import React from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { getUserStatus } from "@/hooks/dashboarddata";
import { Column } from "@/types/interfaces";
import { UsersItem } from "@/lib/api/users/users.service";

type UserStatus = "Suspended" | "Inactive" | "Active";

export const userTableColumns = (roleId: number): Column<UsersItem>[] => {
  const getStatusButton = (status: string) => {
    const backgroundColors: Record<UserStatus, string> = {
      Suspended: "#FF7A7A",
      Inactive: "#FFA726",
      Active: "#046115",
    };

    const safeStatus = (["Suspended", "Inactive", "Active"] as const).includes(status as UserStatus)
      ? (status as UserStatus)
      : "Active"; // fallback to Active if unknown

    return (
      <Button
        variant="contained"
        sx={{
          cursor: "auto",
          textTransform: "none",
          borderRadius: "12px",
          padding: "2px 13px",
          fontSize: "12px",
          backgroundColor: backgroundColors[safeStatus],
          color: "#fff",
          "&:hover": {
            backgroundColor: backgroundColors[safeStatus],
          },
        }}
      >
        {safeStatus}
      </Button>
    );
  };

  const baseColumns: Column<UsersItem>[] = [
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
      render: (user) =>
        user.DateOfRegistration
          ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")
          : "",
    },
    {
      key: "CreatedBy",
      label: "Created By",
      sortable: true,
      filterable: true,
      render: (user) => user.CreatedBy ?? "No value",
    },
    {
      key: "Status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (user) => {
        const status = getUserStatus(user, dayjs().subtract(7, "days"));
        return getStatusButton(status);
      },
    },
  ];

  const extraColumns: Column<UsersItem>[] = [];

  if (roleId === 1 || roleId === 2) {
    extraColumns.push({
      key: "AssignedArea",
      label: "Assigned Area / Zone",
      sortable: true,
      filterable: false,
      render: (user) => user.AssignedArea ?? "No Assigned Area available.",
    });
  }

  if (roleId === 4) {
    extraColumns.push({
      key: "OperatorDetails.OperatorName",
      label: "Company Name",
      sortable: true,
      filterable: false,
      render: (user) =>
        user.OperatorDetails?.OperatorName ?? "No operator assigned",
    });
  }

  if (roleId === 5) {
    extraColumns.push({
      key: "BranchName",
      label: "PSCO Branch",
      sortable: true,
      filterable: false,
      render: (user) => user.BranchName ?? "No branch name assigned",
    });
  }

  // Insert extra columns after the first column (Name)
  baseColumns.splice(1, 0, ...extraColumns);

  return baseColumns;
};
