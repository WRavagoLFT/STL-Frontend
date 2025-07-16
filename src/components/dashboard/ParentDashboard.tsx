"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardSkeletonPage } from "./DashboardSkeleton";
import { ApiResponse } from "@/types/interfaces";
import { WebDashboard } from "@/types/types";
import { fetchWebDashboard } from "@/lib/api/transactions";
const DashboardCardsPage = dynamic(() => import("./DashboardCards"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const DrawResultsPage = dynamic(() => import("./DrawResults"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const TopBettingRegionPage = dynamic(() => import("./TopBettingRegion"), {ssr: false, loading: () => <DashboardSkeletonPage /> });
const TopWinningRegionPage = dynamic(() => import("./TopWinningRegion"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const SummaryBettorsBetsPlacedPage = dynamic(() => import("./SummaryBettorsBetsPlaced"),{ ssr: false, loading: () => <DashboardSkeletonPage /> });
const SummaryWinnersDrawTimePage = dynamic(() => import("./SummaryWinnersDrawTime"),{ ssr: false, loading: () => <DashboardSkeletonPage /> });

export const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardCards, setDashboardCards] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });
  const [topBettingRegions, setTopBettingRegions] = useState<{Region: string, TotalBetAmount: number}[]>();
  const [topWinningRegions, setTopWinningRegions] = useState<{Region: string, TotalPayout: number}[]>([]);

  const [summary, setSummary] = useState<{DrawOrder: number, Bettors: number, Bets: number, Winners: number, Payout: number}[]>([]);
  useEffect(() => {
    // const timer = setTimeout(() => setLoading(false), 1000);
    // return () => clearTimeout(timer);

    const fetchData = async () => {
      try {

        // YYYY-MM-DD format for the date
        const date = new Date().toISOString().split('T')[0];

        const result: ApiResponse<WebDashboard> = await fetchWebDashboard({from: date, to: date});

        //console.log(result)
        if(!result.success) {
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
        })

        setTopBettingRegions(result.data.TopBettingRegions);

        setTopWinningRegions(result.data.TopWinningRegions);

        setSummary(result.data.Summary)

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <DashboardSkeletonPage />
      ) : (
        <Suspense fallback={<DashboardSkeletonPage />}>
          <div className="space-y-4 h-full mt-8 md:mt-0">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardCardsPage {...dashboardCards} />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full space-y-4">
                <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="lg:w-2/5 space-y-4">
                    <DrawResultsPage />
                    <TopBettingRegionPage data={topBettingRegions ?? []} />
                    <TopWinningRegionPage data={topWinningRegions ?? []} />
                  </div>
                  <div className="w-full lg:w-3/5 space-y-6">
                    <SummaryBettorsBetsPlacedPage data={summary ?? []} />
                    <SummaryWinnersDrawTimePage data = {summary ?? []}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};