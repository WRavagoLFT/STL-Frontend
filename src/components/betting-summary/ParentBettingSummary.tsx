"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableBettingActivityToday from "~/components/betting-summary/BettingActivityTodayTable";
import ChartBettorsvsBetsPlacedSummary from "~/components/betting-summary/BettorsvsBetsPlacedChart";
import ChartBettorsSummary from "~/components/betting-summary/BettorCountChart";
import TableBettingSummary from "~/components/betting-summary/BettingSummaryTable";
import ChartBettorsBetTypeSummary from "~/components/betting-summary/BettorCountByBetType";
import BettingSummarySkeleton from "~/components/betting-summary/BettingSummarySkeleton";
import { buttonStyles } from "~/styles/theme";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { useAuthStore } from "~/store/useAuthStore";
import { useRouter } from "next/navigation";

const GAME_TITLES = [
  "STL",
  "STL Pares",
  "STL Swer 2",
  "STL Swer 3",
  "STL Swer 4",
];

export const ParentBettingSummary = ({
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

  useEffect(() => {
    setTitle(GAME_TITLES[gameCategoryId] || "STL");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
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
      `/betting-summary/${mainSlug}/betting-comparisons/${comparisonSlug}`
    );
  };

  const ChartSection = (
    <>
      <ChartBettorsvsBetsPlacedSummary gameCategoryId={gameCategoryId} />
      {gameCategoryId > 0 ? (
        <ChartBettorsBetTypeSummary gameCategoryId={gameCategoryId} />
      ) : (
        <ChartBettorsSummary />
      )}
    </>
  );

  // pass the game category id
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
        <BettingSummarySkeleton />
      ) : (
        <div className="space-y-4 h-full mt-8 md:mt-0">
          <h1 className="text-3xl font-bold">{title} Betting Summary</h1>
          <DashboardCardsPage gameCategoryId={gameCategoryId} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full space-y-4">
              {userTypeId === 6 ? (
                <div className="w-full flex flex-col lg:flex-row lg:min-h-[400px] space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="w-full lg:w-1/3">
                    <TableBettingActivityToday
                      gameCategoryId={gameCategoryId}
                    />
                  </div>
                  <div className="w-full lg:w-2/3 flex flex-col space-y-5">
                    {ChartSection}
                    {ComparisonButton}
                  </div>
                </div>
              ) : (
                (userTypeId === 3 || userTypeId === 4) && (
                  <div className="w-full flex flex-col space-y-5">
                    {ChartSection}
                    {ComparisonButton}
                  </div>
                )
              )}
              <TableBettingSummary gameCategoryId={gameCategoryId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
