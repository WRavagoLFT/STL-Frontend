import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableWinningActivityToday from "~/components/winning-summary/WinningActivityTodayTable";
import ChartWinnersvsWinningsSummary from "~/components/winning-summary/WinnersvsWinningsChart";
import TableWinningSummary from "~/components/winning-summary/WinningSummaryTable";
import ChartWinnersSummary from "~/components/winning-summary/WinnerCountChart";
import ChartWinnersBetTypeSummary from "~/components/winning-summary/WinnerCountBetTypeChart";
import { buttonStyles } from "~/styles/theme";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { useAuthStore } from "~/store/useAuthStore";

const GAME_TITLES = [
  "STL",
  "STL Pares",
  "STL Swer 2",
  "STL Swer 3",
  "STL Swer 4",
];

const WinningSummaryPage = ({ gameCategoryId = 0 }: { gameCategoryId?: number }) => {
  const router = useRouter();
  const [title, setTitle] = useState("STL");
  const userTypeId = useAuthStore((state) => state.userTypeId);

  useEffect(() => {
    setTitle(GAME_TITLES[gameCategoryId] || "STL");
  }, [gameCategoryId]);

  const handleViewComparisonClick = () => {
    router.push("/wins-comparisons");
  };

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
    <div className="self-end my-3">
      <Button variant="contained" sx={buttonStyles} onClick={handleViewComparisonClick}>
        View Comparison
      </Button>
    </div>
  );

  return (
    <AccessGuard allowedUserTypes={[3, 4, 6]}>
      <div className="space-y-4 h-full mt-8 md:mt-0">
        <h1 className="text-3xl font-bold">{title} Winning Summary</h1>
        <DashboardCardsPage gameCategoryId={gameCategoryId} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full space-y-4">
            {userTypeId === 6 ? (
              <div className="w-full flex flex-col lg:flex-row lg:min-h-[500px] space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-1/3">
                  <TableWinningActivityToday gameCategoryId={gameCategoryId} />
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
    </AccessGuard>
  );
};

export default WinningSummaryPage;
