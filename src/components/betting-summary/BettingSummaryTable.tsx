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
    let response = await fetchTransactions();

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }

    if (params.gameCategoryId && params.gameCategoryId > 0) {
      response.data = response.data.filter(
        (item: { GameCategoryId: number }) =>
          item.GameCategoryId === params.gameCategoryId
      );
    }

    const formattedData: Transactions[] = response.data.map(
      (transaction: any) => {
        return {
          transactionNumber: transaction.TransactionNumber,
          date: transaction.DateOfTransaction,
          drawTime:
            transaction.DrawOrder == 1
              ? "First Draw"
              : transaction.DrawOrder == 2
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
          selectedPair: `${transaction.CombinationOne}-${transaction.CombinationTwo}${transaction.CombinationThree > 0 ? `-${transaction.CombinationThree}` : ""}${transaction.CombinationFour > 0 ? `-${transaction.CombinationFour}` : ""}`,
          status: transaction.TransactionStatus,
        };
      }
    );

    setTransactions(formattedData);
    // console.log("TRANSACTIONS:", formattedData);
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  return (
    <ReadOnlyTablePage
      data={transactions}
      columns={tableColumns}
    />
  );
};

export default TableBettingSummary;
