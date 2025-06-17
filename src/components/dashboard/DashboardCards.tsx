import React, { useEffect, useState } from "react";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import { fetchWinners } from "../../utils/api/winners"; // <-- import it
import Card from "../ui/dashboardcards/Cards";

const DashboardCardsPage = ({
  gameCategoryId,
}: {
  gameCategoryId?: number;
}) => {
  const [dashboardData, setDashboardData] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });

        const [summaryResponse, winnersResponse] = await Promise.all([
          fetchHistoricalSummary({ from: today, to: today }),
          fetchWinners({
            from: today,
            to: today,
            gameCategoryId,
          }),
        ]);

        //console.log(winnersResponse);

        if (summaryResponse.success) {
          let filteredData = summaryResponse.data;

          if (gameCategoryId && gameCategoryId > 0) {
            filteredData = filteredData.filter(
              (item: { GameCategoryId: number }) =>
                item.GameCategoryId === gameCategoryId
            );
          }

          const totals = filteredData.reduce(
            (acc: any, item: any) => {
              acc.totalBettors += item.TotalBettors || 0;
              acc.totalBetsPlaced += item.TotalBetAmount || 0;
              acc.totalPayout += item.TotalPayout || 0;
              acc.totalRevenue += item.TotalEarnings || 0;
              return acc;
            },
            {
              totalBettors: 0,
              totalWinners: 0,
              totalBetsPlaced: 0,
              totalPayout: 0,
              totalRevenue: 0,
            }
          );

          // Count number of winning entries
          if (winnersResponse.success && Array.isArray(winnersResponse.data)) {
            totals.totalWinners = winnersResponse.data.length;
          } else {
            console.warn("Failed to fetch winners:", winnersResponse.message);
          }

          setDashboardData(totals);
        } else {
          console.error("API Request Failed:", summaryResponse.message);
        }
      } catch (error) {
        console.error("Error Fetching Dashboard Data:", error);
      }
    };

    fetchDataDashboard();
  }, [gameCategoryId]);

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
