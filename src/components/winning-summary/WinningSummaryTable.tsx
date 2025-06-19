import React, { useState, useEffect } from "react";
import { fetchWinners } from "~/utils/api/winners";
import ReadOnlyTablePage from "../ui/tables/ReadOnlyTable";
import { winningTableColumns } from "~/config/winningTableColumns";
import axios from "axios";

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

const TableWinningSummary = (params: { gameCategoryId?: number }) => {
  const tableColumns = winningTableColumns();
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameCategoryId =
          params.gameCategoryId && params.gameCategoryId > 0
            ? params.gameCategoryId
            : undefined;

        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });

        const fetchParams: {
          from: string;
          to: string;
          gameCategoryId?: number;
        } = {
          from: today,
          to: today,
          ...(gameCategoryId && { gameCategoryId }),
        };

        //console.log("Fetching winners with params:", fetchParams);
        const response = await fetchWinners(fetchParams);
        //console.log("API Response:", response);

        if (response.success) {
          const dataToUse = gameCategoryId
            ? response.data.filter(
                (item: any) => item.GameCategoryId === gameCategoryId
              )
            : response.data;

          const transformedData = dataToUse.map((transaction: any) => ({
            transactionNumber: transaction.TransactionNumber,
            date: new Date(transaction.DateOfTransaction).toLocaleDateString(),
            drawTime:
              transaction.DrawOrder === 1
                ? "First Draw"
                : transaction.DrawOrder === 2
                ? "Second Draw"
                : "Third Draw",
            betAmount: transaction.BetAmount,
            region: transaction.Region,
            province: transaction.Province,
            tumbok: transaction.Tumbok,
            sahod: transaction.Sahod,
            ramble: transaction.Ramble,
            payoutAmount: transaction.PayoutAmount,
            gameType: transaction.GameCategory,
            selectedPair: `${transaction.WinningCombinationOne}-${transaction.WinningCombinationTwo}${
              transaction.WinningCombinationThree > 0
                ? `-${transaction.WinningCombinationThree}`
                : ""
            }${
              transaction.WinningCombinationFour > 0
                ? `-${transaction.WinningCombinationFour}`
                : ""
            }`,
            status: transaction.TransactionStatus,
          }));

          setTransactions(transformedData);
          console.log('WINNING TABLE SUMMARY:', transformedData);
        } else {
          console.error("API returned failure:", response.message);
          setError(response.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching transactions");
        console.error("Caught error in fetchData:", err);

        if (axios.isAxiosError(err)) {
          console.error("Axios error response:", err.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.gameCategoryId]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return <ReadOnlyTablePage data={transactions} columns={tableColumns} />;
};

export default TableWinningSummary;
