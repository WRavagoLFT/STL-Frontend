import React from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { getUserStatus } from "~/utils/dashboarddata";
import { User } from "~/types/types";
import { Column } from "~/types/interfaces";

export const userTableColumns = (operatorMap: Record<string, any>): Column<User>[] => [
  {
    key: "fullName",
    label: "Name",
    sortable: true,
    filterable: false,
  },
  {
    key: "OperatorDetails.OperatorName",
    label: "Company Name",
    sortable: true,
    filterable: false,
    render: (user) =>
      user.OperatorDetails?.OperatorName ?? "No operator assigned",
  },
  {
    key: "DateOfRegistration",
    label: "Creation Date",
    sortable: true,
    filterable: true,
    render: (user: User) =>
      user.DateOfRegistration
        ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")
        : "",
  },
  {
    key: "CreatedBy",
    label: "Created By",
    sortable: true,
    filterable: true,
  },
  {
    key: "Status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (user: User) => {
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
