import dayjs from "dayjs";
import React from "react";
import Button from "@mui/material/Button";
import { getUserStatus } from "~/hooks/dashboarddata";
import { Operator } from "~/types/types";
import { Column } from "~/types/interfaces";

export const operatorTableColumns = (): Column<Operator>[] => [
  {
    key: "OperatorName",
    label: "Name",
    sortable: true,
    filterable: false,
  },
  {
    key: "Cities",
    label: "Approved Area of Operations",
    sortable: true,
    filterable: false,
    filterKey: "Cities",
    filterValue: (row: Operator) =>
      Array.isArray(row.Cities)
        ? row.Cities.map((c) => c.CityName).join(", ")
        : "",
    render: (row: Operator) =>
      Array.isArray(row.Cities) && row.Cities.length
        ? row.Cities.map((city) => city.CityName).join(", ")
        : "No cities",
  },
  {
    key: "DateOfOperation",
    label: "Date of Operations",
    sortable: true,
    filterable: true,
    filterKey: "DateOfOperation",
    render: (user: Operator) =>
      user.DateOfOperation
        ? dayjs(user.DateOfOperation).format("YYYY/MM/DD HH:mm:ss")
        : "",
  },
  {
    key: "Executive",
    label: "Created By",
    sortable: true,
    filterable: false,
    render: (operator: Operator) => operator?.Executive || "No executive",
  },
  {
    key: "Status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (user: Operator) => {
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
