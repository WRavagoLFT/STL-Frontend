import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { AccessGuard } from "~/components/AccessGuard";
import GameCombinationModal from "~/components/dashboard/GameCombinationForm";

const DashboardSkeletonPage = dynamic(() => import("~/components/dashboard/DashboardSkeleton")
  .then((mod) => ({default: mod.DashboardSkeletonPage,})));
const DashboardCardsPage = React.lazy(() => import("~/components/dashboard/DashboardCards"));
const DrawResultsPage = React.lazy(() => import("~/components/dashboard/DrawResults"));
const TopBettingRegionPage = React.lazy(() => import("~/components/dashboard/TopBettingRegion"));
const TopWinningRegionPage = React.lazy(() => import("~/components/dashboard/TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = React.lazy(() => import("~/components/dashboard/SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = React.lazy(() => import("~/components/dashboard/SummaryWinnersDrawTime"));

const DashboardPage = () => {
  return (
    <AccessGuard allowedUserTypes={[1, 2, 3, 4, 5, 6]}>
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
                <GameCombinationModal />
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
    </AccessGuard>
  );
};

export default DashboardPage;
