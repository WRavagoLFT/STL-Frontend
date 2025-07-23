"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApiResponse } from "@/types/interfaces";
import { WebDashboard } from "@/types/types";
import { fetchWebDashboard } from "@/lib/api/transactions";
import { DashboardSkeletonPage } from "./DashboardSkeleton";
const DashboardCardsPage = dynamic(() => import("./DashboardCards"));
const DrawResultsPage = dynamic(() => import("./DrawResults"));
const TopBettingRegionPage = dynamic(() => import("./TopBettingRegion"));
const TopWinningRegionPage = dynamic(() => import("./TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = dynamic(() => import("./SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = dynamic(() => import("./SummaryWinnersDrawTime"));

export const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardCards, setDashboardCards] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });
  const [topBettingRegions, setTopBettingRegions] = useState<{ Region: string, TotalBetAmount: number }[]>();
  const [topWinningRegions, setTopWinningRegions] = useState<{ Region: string, TotalPayout: number }[]>([]);
  const [summary, setSummary] = useState<{ DrawOrder: number, Bettors: number, Bets: number, Winners: number, Payout: number }[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const date = new Date().toISOString().split('T')[0];

      const result: ApiResponse<WebDashboard> = await fetchWebDashboard({ from: date, to: date });

      if (!result.success) {
        console.error("Failed to fetch dashboard data:", result.message);
        setLoading(false);
        return;
      }

      setDashboardCards({
        totalBettors: result.data.Metrics.TotalBettors,
        totalWinners: result.data.Metrics.TotalWinners,
        totalBetsPlaced: result.data.Metrics.TotalBetsPlaced,
        totalPayout: result.data.Metrics.TotalPayout,
        totalRevenue: result.data.Metrics.TotalRevenue,
      });

      setTopBettingRegions(result.data.TopBettingRegions);
      setTopWinningRegions(result.data.TopWinningRegions);
      setSummary(result.data.Summary);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // if (loading) {
  //   return <DashboardSkeletonPage />;
  // };

  return (
    <div className="space-y-4 h-full mt-8 md:mt-0">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardCardsPage 
        {...dashboardCards}
        loading={loading}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full space-y-4">
          <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="lg:w-2/5 space-y-4">
              <DrawResultsPage
                loading={loading}
              />
              <TopBettingRegionPage 
                data={topBettingRegions ?? []}
                loading={loading}
                />
              <TopWinningRegionPage 
                data={topWinningRegions ?? []}
                loading={loading}
                />
            </div>
            <div className="w-full lg:w-3/5 space-y-6">
              <SummaryBettorsBetsPlacedPage data={summary ?? []}
                loading={loading}
              />
              <SummaryWinnersDrawTimePage data={summary ?? []}
                loading={loading}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};