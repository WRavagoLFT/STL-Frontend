import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

// Components
import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableBettingActivityToday from "~/components/betting-summary/BettingActivityTodayTable";
import ChartBettorsvsBetsPlacedSummary from "~/components/betting-summary/BettorsvsBetsPlacedChart";
import ChartBettorsSummary from "~/components/betting-summary/BettorCountChart";
import TableBettingSummary from "~/components/betting-summary/BettingSummaryTable";
import ChartBettorsBetTypeSummary from "~/components/betting-summary/BettorCountByBetType";
import { buttonStyles } from "~/styles/theme";
import { AccessGuard } from "~/components/auth/AccessGuard";

const BettingSummaryPage = (params: { gameCategoryId?: number }) => {
  const router = useRouter();
  //console.log("Game Category: ", params.gameCategoryId);

   const [ title, setTitle ] = useState('STL')

  useEffect(() => {
    switch(params.gameCategoryId) {
      case 0: 
        setTitle('STL')
        break;
      case 1:
        setTitle('STL Pares')
        break;
      case 2:
        setTitle('STL Swer 2')
        break;
      case 3:
        setTitle('STL Swer 3')
        break;
      case 4:
        setTitle('STL Swer 4')
        break;
    }
  }, [params.gameCategoryId])

  const handleViewComparisonClick = () => {
    router.push("/bets-comparisons");
  };

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <div className="space-y-4 h-full">
        <h1 className="text-3xl font-bold">{title} Betting Summary</h1>
        <DashboardCardsPage gameCategoryId={params.gameCategoryId} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full space-y-4">
            <div className="w-full flex flex-col lg:flex-row lg:items-stretch lg:min-h-[500px] space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Left Column */}
              <div className="w-full lg:w-1/3 h-full flex flex-col">
                <div className="flex-1">
                  <TableBettingActivityToday
                    gameCategoryId={params.gameCategoryId}
                  />
                </div>
              </div>
              {/* Right Column */}
              <div className="w-full lg:w-2/3 h-full flex flex-col">
                <div className="flex-1 flex flex-col space-y-5">
                  <ChartBettorsvsBetsPlacedSummary
                    gameCategoryId={params.gameCategoryId}
                  />
                  {params.gameCategoryId && params.gameCategoryId > 0 ? (
                    <ChartBettorsBetTypeSummary
                      gameCategoryId={params.gameCategoryId}
                    />
                  ) : (
                    <ChartBettorsSummary />
                  )}
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
              <TableBettingSummary gameCategoryId={params.gameCategoryId} />
            </div>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
};

export default BettingSummaryPage;
