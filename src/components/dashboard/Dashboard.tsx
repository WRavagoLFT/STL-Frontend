"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardSkeletonPage } from "./DashboardSkeleton";
const DashboardCardsPage = dynamic(() => import("./DashboardCards"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const DrawResultsPage = dynamic(() => import("./DrawResults"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const TopBettingRegionPage = dynamic(() => import("./TopBettingRegion"), {ssr: false, loading: () => <DashboardSkeletonPage /> });
const TopWinningRegionPage = dynamic(() => import("./TopWinningRegion"), {ssr: false, loading: () => <DashboardSkeletonPage />});
const SummaryBettorsBetsPlacedPage = dynamic(() => import("./SummaryBettorsBetsPlaced"),{ ssr: false, loading: () => <DashboardSkeletonPage /> });
const SummaryWinnersDrawTimePage = dynamic(() => import("./SummaryWinnersDrawTime"),{ ssr: false, loading: () => <DashboardSkeletonPage /> });
const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <DashboardSkeletonPage />
      ) : (
        <Suspense fallback={<DashboardSkeletonPage />}>
          <div className="space-y-4 h-full mt-8 md:mt-0">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardCardsPage />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full space-y-4">
                <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="lg:w-2/5 space-y-4">
                    <DrawResultsPage />
                    <TopBettingRegionPage />
                    <TopWinningRegionPage />
                  </div>
                  <div className="w-full lg:w-3/5 space-y-6">
                    <SummaryBettorsBetsPlacedPage />
                    <SummaryWinnersDrawTimePage />
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

export default Dashboard;
