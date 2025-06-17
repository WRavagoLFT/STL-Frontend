import React, { Suspense, useEffect, useState } from "react";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { DashboardSkeletonPage } from "~/components/dashboard/DashboardSkeleton";

const DashboardCardsPage = React.lazy(
  () => import("~/components/dashboard/DashboardCards")
);
const DrawResultsPage = React.lazy(
  () => import("~/components/dashboard/DrawResults")
);
const TopBettingRegionPage = React.lazy(
  () => import("~/components/dashboard/TopBettingRegion")
);
const TopWinningRegionPage = React.lazy(
  () => import("~/components/dashboard/TopWinningRegion")
);
const SummaryBettorsBetsPlacedPage = React.lazy(
  () => import("~/components/dashboard/SummaryBettorsBetsPlaced")
);
const SummaryWinnersDrawTimePage = React.lazy(
  () => import("~/components/dashboard/SummaryWinnersDrawTime")
);

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
          <div className="space-y-4 h-full mt-8 md:mt-0">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardCardsPage />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full space-y-4">
                <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  {/* Left Column */}
                  <div className="lg:w-2/5 space-y-4">
                    <DrawResultsPage />
                    <TopBettingRegionPage />
                    <TopWinningRegionPage />
                  </div>

                  {/* Right Column: 3/5 */}
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
    </AccessGuard>
  );
};

export default DashboardPage;
