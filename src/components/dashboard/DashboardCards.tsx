"use client";

import React, { useEffect, useState } from "react";
import Card from "../ui/dashboardcards/Cards";

interface DashboardCardsData {
  totalBettors: number;
  totalWinners: number;
  totalBetsPlaced: number;
  totalPayout: number;
  totalRevenue: number;
  loading?: boolean;
}

const DashboardCardsPage = ({
  totalBettors,
  totalWinners,
  totalBetsPlaced,
  totalPayout,
  totalRevenue,
  loading
}: DashboardCardsData) => {
  const [dashboardData, setDashboardData] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // console.log("Setting Dashboard Data:", {
    //   totalBettors,
    //   totalWinners,
    //   totalBetsPlaced,
    //   totalPayout,
    //   totalRevenue,
    // });
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
        <Card key={index} label={item.label} value={item.value} loading={loading}/>
      ))}
    </div>
  );
};

export default DashboardCardsPage;
