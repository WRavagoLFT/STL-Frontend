import React from "react";
import { Button } from "@mui/material";
import { useRouter } from 'next/router';

// Components
import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableWinningActivityToday from "~/components/winning-summary/WinningActivityTodayTable";
import ChartWinnersvsWinningsSummary from "~/components/winning-summary/WinnersvsWinningsChart";
import TableWinningSummary from "~/components/winning-summary/WinningSummaryTable";
import ChartWinnersSummary from "~/components/winning-summary/WinnerCountChart";
import ChartWinnersBetTypeSummary from "~/components/winning-summary/WinnerCountBetTypeChart";
import { buttonStyles } from "~/styles/theme";

const WinningSummaryPage = (params: {gameCategoryId?: number}) => {
  const router = useRouter();

  const handleViewComparisonClick = () => {
    router.push("/wins-comparisons")
  }
  return (
    <div className="space-y-4 h-full">
      <h1 className="text-3xl font-bold">STL Winning Summary</h1>
      <DashboardCardsPage gameCategoryId={params.gameCategoryId} />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full space-y-4">
          <div className="w-full flex flex-col lg:flex-row lg:items-stretch lg:min-h-[500px] space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Left Column */}
            <div className="w-full lg:w-1/3 h-full flex flex-col">
              <div className="flex-1">
                <TableWinningActivityToday
                  gameCategoryId={params.gameCategoryId}
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="w-full lg:w-2/3 h-full flex flex-col">
              <div className="flex-1 flex flex-col space-y-6">
                <ChartWinnersvsWinningsSummary gameCategoryId={params.gameCategoryId}/>
                {
                params.gameCategoryId && params.gameCategoryId > 0 ? 
                <ChartWinnersBetTypeSummary gameCategoryId={params.gameCategoryId}/> : 
                  <ChartWinnersSummary />
              }
              </div>
              <div className="self-end my-3">
                <Button
                  variant="contained"
                  sx={buttonStyles}
                  onClick={handleViewComparisonClick}
                >
                  View Comparison
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <TableWinningSummary gameCategoryId={params.gameCategoryId}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningSummaryPage;