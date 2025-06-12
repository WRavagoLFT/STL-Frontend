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

const TableBettingSummary = (params: { gameCategoryId?: number }) => {
  const tableColumns = bettingTableColumns();
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  const fetchTransactionsData = async () => {
    const response = await fetchTransactions();

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }

    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    // filter by today's date
    const transactionsToday = response.data.filter(
      (item: { DateOfTransaction: string }) => {
        // Assuming DateOfTransaction is also in "YYYY-MM-DD" format or can be converted
        const transactionDate = new Date(item.DateOfTransaction).toISOString().split('T')[0];
        return transactionDate === todayFormatted;
      }
    );

    // Then, apply gameCategoryId filter if it exists
    const filteredData =
      params.gameCategoryId && params.gameCategoryId > 0
        ? transactionsToday.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          )
        : transactionsToday; // Use transactionsToday here

    const formattedData: Transactions[] = filteredData.map(
      (transaction: any) => ({
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
          transaction.CombinationThree > 0
            ? `-${transaction.CombinationThree}`
            : ""
        }${
          transaction.CombinationFour > 0
            ? `-${transaction.CombinationFour}`
            : ""
        }`,
        status: transaction.TransactionStatus,
      })
    );

    setTransactions(formattedData);
    //console.log('IN THE SUMMARY TABLE:', formattedData);
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [params.gameCategoryId]);

  return (
    <ReadOnlyTablePage
      data={transactions}
      columns={tableColumns}
    />
  );
};

export default TableBettingSummary;
