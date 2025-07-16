"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import TableWinningActivityToday from "@/components/winning-summary/WinningActivityTodayTable";
import ChartWinnersvsWinningsSummary from "@/components/winning-summary/WinnersvsWinningsChart";
import TableWinningSummary from "@/components/winning-summary/WinningSummaryTable";
import ChartWinnersBetTypeSummary from "@/components/winning-summary/WinnerCountBetTypeChart";
import WinningSummarySkeleton from "@/components/winning-summary/WinningSummarySkeleton";
import { buttonStyles } from "@/styles/theme";
import { useAuthStore } from "@/store/useAuthStore";
import ChartWinnersSummary from "@/components/winning-summary/WinnerCountChart";
import Card from "../ui/dashboardcards/Cards";
import { fetchHistoricalSummary } from "@/lib/api/transactions";
import { fetchWinners } from "@/lib/api/winners";

const GAME_TITLES = [
  "STL",
  "STL Pares",
  "STL Swer 2",
  "STL Swer 3",
  "STL Swer 4",
];

interface DashboardCardsData {
  totalBettors: number;
  totalWinners: number;
  totalBetsPlaced: number;
  totalPayout: number;
  totalRevenue: number;
}

export const ParentWinningSummaryPage = ({
  gameCategoryId = 0,
  slug,
}: {
  gameCategoryId?: number;
  slug?: string;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("STL");
  const userTypeId = useAuthStore((state) => state.userTypeId);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardCardsData>({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setTitle(GAME_TITLES[gameCategoryId] || "STL");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [gameCategoryId]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });

        const [summaryResponse, winnersResponse] = await Promise.all([
          fetchHistoricalSummary({ from: today, to: today }),
          fetchWinners({ from: today, to: today, gameCategoryId }),
        ]);

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

          if (winnersResponse.success && Array.isArray(winnersResponse.data)) {
            const filteredWinners = winnersResponse.data.filter(
              (item: { DateOfTransaction?: string }) => {
                if (typeof item.DateOfTransaction !== "string") return false;

                const localDate = new Date(
                  item.DateOfTransaction
                ).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

                return localDate === today;
              }
            );

            totals.totalWinners = filteredWinners.length;
          }

          setDashboardData(totals);
        }
      } catch (error) {
        console.error("[Dashboard] Error fetching dashboard data:", error);
      }
    };

    fetchDataDashboard();
  }, [gameCategoryId]);

  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/-(\d+)/g, "$1");

  const handleViewComparisonClick = () => {
    const comparisonSlug = slugify(title);
    const mainSlug = slug || "dashboard";
    router.push(
      `/winning-summary/${mainSlug}/winning-comparisons/${comparisonSlug}`
    );
  };

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

  const ChartSection = (
    <>
      <ChartWinnersvsWinningsSummary gameCategoryId={gameCategoryId} />
      {gameCategoryId > 0 ? (
        <ChartWinnersBetTypeSummary gameCategoryId={gameCategoryId} />
      ) : (
        <ChartWinnersSummary />
      )}
    </>
  );

  const ComparisonButton = (
    <div className="w-full xl:w-auto xl:self-end xl:ml-auto my-3 flex">
      <Button
        fullWidth
        variant="contained"
        sx={buttonStyles}
        onClick={handleViewComparisonClick}
      >
        View Comparison
      </Button>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <WinningSummarySkeleton />
      ) : (
        <div className="space-y-4 h-full mt-8 md:mt-0">
          <h1 className="text-3xl font-bold">{title} Winning Summary</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
          {cardItems.map((item, index) => (
            <Card
              key={index}
              label={item.label}
              value={item.value}
            />
          ))} 
        </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full space-y-4">
              {userTypeId === 6 ? (
                <div className="w-full flex flex-col lg:flex-row lg:min-h-[500px] space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="w-full lg:w-1/3">
                    <TableWinningActivityToday
                      gameCategoryId={gameCategoryId}
                    />
                  </div>
                  <div className="w-full lg:w-2/3 flex flex-col space-y-6">
                    {ChartSection}
                    {ComparisonButton}
                  </div>
                </div>
              ) : (
                (userTypeId === 3 || userTypeId === 4) && (
                  <div className="w-full flex flex-col space-y-6">
                    {ChartSection}
                    {ComparisonButton}
                  </div>
                )
              )}
              <TableWinningSummary gameCategoryId={gameCategoryId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
