import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { Column } from "~/types/interfaces";
import { Transactions } from "~/components/betting-summary/BettingSummaryTable";

export const bettingTableColumns = (): Column<Transactions>[] => [
  {
    key: "transactionNumber",
    label: "Transaction Number",
    sortable: true,
    filterable: false,
  },
  {
    key: "date",
    label: "Date",
    sortable: true,
    filterable: true,
    filterKey: "DateOfTransaction",
    render: (row: Transactions) => {
      if (!row.DateOfTransaction || !dayjs(row.DateOfTransaction, [
        "YYYY-MM-DD",
        "DD/MM/YYYY",
        "MM/DD/YYYY",
        "YYYY-MM-DD HH:mm:ss",
      ]).isValid()) {
        console.warn("Invalid date in render:", row.DateOfTransaction);
        return "Invalid Date";
      }
      return dayjs(row.DateOfTransaction, [
        "YYYY-MM-DD",
        "DD/MM/YYYY",
        "MM/DD/YYYY",
        "YYYY-MM-DD HH:mm:ss",
      ]).format("YYYY/MM/DD HH:mm:ss");
    },
  },
  {
    key: "drawTime",
    label: "Draw Time",
    sortable: true,
    filterable: true,
  },
  {
    key: "betAmount",
    label: "Bet Amount",
    sortable: true,
    filterable: false,
    render: (row: Transactions) => `₱${row.betAmount.toLocaleString()}`,
  },
  {
    key: "gameType",
    label: "Game Type",
    sortable: true,
    filterable: true,
  },
  {
    key: "BetType",
    label: "Bet Type",
    sortable: true,
    filterable: true,
    render: (row: any) => {
      const types = [];

      if (row.tumbok) types.push("Tumbok");
      if (row.sahod) types.push("Sahod");
      if (row.ramble) types.push("Ramble");
      if (row.tresCasas) types.push("Tres Casas");
      if (row.saisCasas) types.push("Sais Casas");
      if (row.dyisCasas) types.push("Dyis Casas");

      return types.join(" / ");
    },
  },
  {
    key: "selectedPair",
    label: "Bet Pattern",
    sortable: true,
    filterable: false,
    render: (row: Transactions) => row.selectedPair,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (transaction: Transactions) => {
      const isValid = transaction.status === "Valid";
      return (
        <Button
          variant="contained"
          sx={{
            cursor: "auto",
            textTransform: "none",
            borderRadius: "12px",
            padding: "1px 17px",
            fontSize: "12px",
            backgroundColor: isValid ? "#046115" : "#CE1126",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: isValid ? "#046115" : "#CE1126",
            },
          }}
        >
          {isValid ? "Confirm" : "Void"}
        </Button>
      );
    },
  },
];