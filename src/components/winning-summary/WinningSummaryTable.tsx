"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchWinners } from "~/utils/api/winners";
import { winningTableColumns } from "~/config/winningTableColumns";
import ReadOnlyTablePage from "../ui/tables/ReadOnlyTable";
import useDetailTableStore from "~/store/useTableStore";

export interface Transactions {
  transactionNumber: string;
  date: string;
  drawTime: string;
  region: string;
  province: string;
  betAmount: number;
  tumbok: number;
  sahod: number;
  ramble: number;
  winType: string;
  gameType: string;
  selectedPair: string;
  status: string;
  payoutAmount: number;
}

const TableWinningSummary = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const tableColumns = winningTableColumns();
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { filters } = useDetailTableStore();

  const fetchWinnersData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWinners({
        from: filters.date || dayjs().format("YYYY-MM-DD"),
        to: filters.date || dayjs().format("YYYY-MM-DD"),
        ...(gameCategoryId && gameCategoryId > 0 ? { gameCategoryId } : {}),
      });

      if (!response.success || response.data.length === 0) {
        console.warn("No winners found or API call failed");
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
            typeof transaction.WinningCombinationOne === "number"
              ? transaction.WinningCombinationOne
              : 0;
          const combinationTwo =
            typeof transaction.WinningCombinationTwo === "number"
              ? transaction.WinningCombinationTwo
              : 0;
          const combinationThree =
            typeof transaction.WinningCombinationThree === "number"
              ? transaction.WinningCombinationThree
              : 0;
          const combinationFour =
            typeof transaction.WinningCombinationFour === "number"
              ? transaction.WinningCombinationFour
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
            region: transaction.Region,
            province: transaction.Province,
            betAmount: transaction.BetAmount,
            tumbok: transaction.Tumbok,
            sahod: transaction.Sahod,
            ramble: transaction.Ramble,
            winType: transaction.WinType || "", // Handle winType if applicable
            gameType: transaction.GameCategory,
            selectedPair: `${combinationOne}-${combinationTwo}${
              combinationThree > 0 ? `-${combinationThree}` : ""
            }${combinationFour > 0 ? `-${combinationFour}` : ""}`,
            status: transaction.TransactionStatus,
            payoutAmount: transaction.PayoutAmount,
            DateOfTransaction: transaction.DateOfTransaction,
          };
        }
      );

      setTransactions(formattedData);
      console.log("WINNING TABLE SUMMARY:", formattedData);
    } catch (error) {
      console.error("Error fetching winners:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnersData();
  }, [gameCategoryId, filters.date]);

  return (
    <div className="overflow-x-auto w-full">
      <ReadOnlyTablePage data={transactions} columns={tableColumns} />
    </div>
  );
};

export default TableWinningSummary;