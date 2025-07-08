"use client";

import React, { useEffect, useState } from "react";
import { fetchHistoricalSummary } from "../../lib/api/transactions";
import { fetchWinners } from "../../lib/api/winners";
import Card from "../ui/dashboardcards/Cards";

interface DashboardCardsData {
  totalBettors: number;
  totalWinners: number;
  totalBetsPlaced: number;
  totalPayout: number;
  totalRevenue: number;
}

const DashboardCardsPage = ({
  totalBettors,
  totalWinners,
  totalBetsPlaced,
  totalPayout,
  totalRevenue,
}: DashboardCardsData) => {
  const [dashboardData, setDashboardData] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  // console.log('GAME CATEG ID:', gameCategoryId);

// useEffect(() => {
//   const fetchDataDashboard = async () => {
//     try {
//       const today = new Date().toLocaleDateString("en-CA", {
//         timeZone: "Asia/Manila",
//       });

//       const [summaryResponse, winnersResponse] = await Promise.all([
//         fetchHistoricalSummary({ from: today, to: today }),
//         fetchWinners({
//           from: today,
//           to: today,
//           gameCategoryId,
//         }),
//       ]);

//       if (summaryResponse.success) {
//         let filteredData = summaryResponse.data;

//         if (gameCategoryId && gameCategoryId > 0) {
//           filteredData = filteredData.filter(
//             (item: { GameCategoryId: number }) =>
//               item.GameCategoryId === gameCategoryId
//           );
//         } else {
//           console.log("[DEBUG] No GameCategoryId filter applied.");
//         }

//         const totals = filteredData.reduce(
//           (acc: any, item: any) => {
//             acc.totalBettors += item.TotalBettors || 0;
//             acc.totalBetsPlaced += item.TotalBetAmount || 0;
//             acc.totalPayout += item.TotalPayout || 0;
//             acc.totalRevenue += item.TotalEarnings || 0;
//             return acc;
//           },
//           {
//             totalBettors: 0,
//             totalWinners: 0,
//             totalBetsPlaced: 0,
//             totalPayout: 0,
//             totalRevenue: 0,
//           }
//         );

//         if (winnersResponse.success && Array.isArray(winnersResponse.data)) {
//           const filteredWinners = winnersResponse.data.filter(
//             (item: { DateOfTransaction?: string }) => {
//               if (typeof item.DateOfTransaction !== "string") return false;

//               const localDate = new Date(item.DateOfTransaction).toLocaleDateString("en-CA", {
//                 timeZone: "Asia/Manila",
//               });

//               return localDate === today;
//             }
//           );

//           totals.totalWinners = filteredWinners.length;
//         } else {
//           console.warn("[DEBUG] Failed to fetch or invalid winners data:", winnersResponse.message);
//         }
//         setDashboardData(totals);
//       } else {
//         console.error("[DEBUG] Summary API Request Failed:", summaryResponse.message);
//       }
//     } catch (error) {
//       console.error("[DEBUG] Error Fetching Dashboard Data:", error);
//     }
//   };

//   fetchDataDashboard();
// }, [gameCategoryId]);

  useEffect(() => {
    console.log("Setting Dashboard Data:", {
      totalBettors,
      totalWinners,
      totalBetsPlaced,
      totalPayout,
      totalRevenue,
    });
    setDashboardData({
      totalBettors: totalBettors,
      totalWinners: totalWinners,
      totalBetsPlaced: totalBetsPlaced,
      totalPayout: totalPayout,
      totalRevenue: totalRevenue,
    });
  }, [])


  const cardItems = [
    { label: "Total Bettors", value: dashboardData.totalBettors },
    { label: "Total Winners", value: dashboardData.totalWinners },
    {
      label: "Total Bets Placed",
      value: `₱ ${dashboardData.totalBetsPlaced.toLocaleString()}`,
    },
    {
      label: "Total Payout",
      value: `₱ ${dashboardData.totalPayout.toLocaleString()}`,
    },
    {
      label: "Total Revenue",
      value: `₱ ${dashboardData.totalRevenue.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
      {cardItems.map((item, index) => (
        <Card key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default DashboardCardsPage;
