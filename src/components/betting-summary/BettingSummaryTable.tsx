import React, { useState, useEffect } from "react";
import { fetchTransactions } from "~/utils/api/transactions";
import { bettingTableColumns } from "~/config/bettingTableColumns";
import ReadOnlyTablePage from "../ui/tables/ReadOnlyTable";

export interface Transactions {
  transactionNumber: string;
  date: string;
  drawTime: string;
  betAmount: number;
  tumbok: number;
  sahod: number;
  ramble: number;
  gameType: string;
  selectedPair: string;
  status: string;
  DateOfTransaction?: string;
  saisCasas?: number;
  tresCasas?: number;
  dyisCasas?: number;
}

const TableBettingSummary = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const tableColumns = bettingTableColumns();
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  const fetchTransactionsData = async () => {
    const response = await fetchTransactions();

    if (!response.success || response.data.length === 0) return;

    const todayFormatted = new Date().toISOString().split("T")[0];

    const transactionsToday = response.data.filter(
      (item: { DateOfTransaction: string }) => {
        const transactionDate = new Date(item.DateOfTransaction).toISOString().split("T")[0];
        return transactionDate === todayFormatted;
      }
    );

    const filteredData =
      gameCategoryId && gameCategoryId > 0
        ? transactionsToday.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === gameCategoryId
          )
        : transactionsToday;

    const formattedData: Transactions[] = filteredData.map((transaction: any) => ({
      transactionNumber: transaction.TransactionNumber,
      date: transaction.DateOfTransaction,
      drawTime:
        transaction.DrawOrder === 1
          ? "First Draw"
          : transaction.DrawOrder === 2
          ? "Second Draw"
          : "Third Draw",
      betAmount: transaction.BetAmount,
      tumbok: transaction.Tumbok,
      sahod: transaction.Sahod,
      ramble: transaction.Ramble,
      tresCasas: transaction.TresCasas,
      saisCasas: transaction.SaisCasas,
      dyisCasas: transaction.DyisCasas,
      gameType: transaction.GameCategory,
      selectedPair: `${transaction.CombinationOne}-${transaction.CombinationTwo}${
        transaction.CombinationThree > 0 ? `-${transaction.CombinationThree}` : ""
      }${transaction.CombinationFour > 0 ? `-${transaction.CombinationFour}` : ""}`,
      status: transaction.TransactionStatus,
    }));

    setTransactions(formattedData);
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [gameCategoryId]);

  return (
    <div className="overflow-x-auto w-full">
      <ReadOnlyTablePage data={transactions} columns={tableColumns} />
    </div>
  );
};

export default TableBettingSummary;
