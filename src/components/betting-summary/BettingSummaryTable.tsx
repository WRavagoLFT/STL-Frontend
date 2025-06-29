"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchTransactions } from "~/lib/api/transactions";
import { bettingTableColumns } from "~/config/bettingTableColumns";
import ReadOnlyTablePage from "../ui/tables/ReadOnlyTable";
import useDetailTableStore from "~/store/useTableStore";

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

const TableBettingSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const tableColumns = bettingTableColumns();
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { filters } = useDetailTableStore();

  const fetchTransactionsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTransactions();

      if (!response.success || response.data.length === 0) {
        console.warn("No transactions found or API call failed");
        setTransactions([]);
        return;
      }

      const selectedDate = filters.date || dayjs().format("YYYY-MM-DD");

      let filteredTransactions = response.data;

      if (selectedDate) {
        filteredTransactions = response.data.filter(
          (item: { DateOfTransaction: string }) => {
            if (!item.DateOfTransaction) {
              console.warn("Invalid DateOfTransaction:", item);
              return false;
            }
            const transactionDate = dayjs(item.DateOfTransaction, [
              "YYYY-MM-DD",
              "DD/MM/YYYY",
              "MM/DD/YYYY",
              "YYYY-MM-DD HH:mm:ss",
            ]);
            if (!transactionDate.isValid()) {
              console.warn("Unparseable date:", item.DateOfTransaction);
              return false;
            }
            return transactionDate.format("YYYY-MM-DD") === selectedDate;
          }
        );
      }

      const filteredData =
        gameCategoryId && gameCategoryId > 0
          ? filteredTransactions.filter(
              (item: { GameCategoryId: number }) =>
                item.GameCategoryId === gameCategoryId
            )
          : filteredTransactions;

      const formattedData: Transactions[] = filteredData.map(
        (transaction: any) => {
          const combinationOne =
            typeof transaction.CombinationOne === "number"
              ? transaction.CombinationOne
              : 0;
          const combinationTwo =
            typeof transaction.CombinationTwo === "number"
              ? transaction.CombinationTwo
              : 0;
          const combinationThree =
            typeof transaction.CombinationThree === "number"
              ? transaction.CombinationThree
              : 0;
          const combinationFour =
            typeof transaction.CombinationFour === "number"
              ? transaction.CombinationFour
              : 0;

          return {
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
            selectedPair: `${combinationOne}-${combinationTwo}${
              combinationThree > 0 ? `-${combinationThree}` : ""
            }${combinationFour > 0 ? `-${combinationFour}` : ""}`,
            status: transaction.TransactionStatus,
            DateOfTransaction: transaction.DateOfTransaction,
          };
        }
      );

      setTransactions(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [gameCategoryId, filters.date]);

  return (
    <div className="overflow-x-auto w-full">
      <ReadOnlyTablePage data={transactions} columns={tableColumns} />
    </div>
  );
};

export default TableBettingSummary;
