import React, { Suspense, useEffect, useState } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { DashboardSkeletonPage } from "~/components/dashboard/DashboardSkeleton";

const DashboardCardsPage = React.lazy(() => import("~/components/dashboard/DashboardCards"));
const DrawResultsPage = React.lazy(() => import("~/components/dashboard/DrawResults"));
const TopBettingRegionPage = React.lazy(() => import("~/components/dashboard/TopBettingRegion"));
const TopWinningRegionPage = React.lazy(() => import("~/components/dashboard/TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = React.lazy(() => import("~/components/dashboard/SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = React.lazy(() => import("~/components/dashboard/SummaryWinnersDrawTime"));

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      {loading ? (
        <DashboardSkeletonPage />
      ) : (
        <Suspense fallback={<DashboardSkeletonPage />}>
          <div className="space-y-4 h-full">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardCardsPage />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full space-y-4">
                <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  {/* Left Column */}
                  <div className="space-y-6 w-full lg:w-1/3">
                    <DrawResultsPage />
                    <TopBettingRegionPage />
                    <TopWinningRegionPage />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 w-full lg:w-2/3">
                    <SummaryBettorsBetsPlacedPage />
                    <SummaryWinnersDrawTimePage />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </AccessGuard>
  );
};

export default DashboardPage;
