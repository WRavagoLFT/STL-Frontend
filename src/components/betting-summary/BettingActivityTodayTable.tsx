"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  fetchHistoricalRegion,
  fetchHistoricalSummary,
} from "~/utils/api/transactions";
import { historicalSummaryByRegionCategory } from "~/utils/transforms";
import { FaDiceSix } from "react-icons/fa";

interface RegionData {
  Region: string;
  TotalBetAmount: number;
  trend?: number | undefined;
}

const TableBettingActivityToday = (params: { gameCategoryId?: number }) => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: number }[]
  >([]);
  const [gameCategoryId, setGameCategoryId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getBettingRegions = async () => {
    setIsLoading(true);

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const [todayRes, yestRes] = await Promise.all([
      fetchHistoricalRegion({ date: todayStr }),
      fetchHistoricalRegion({ date: yesterdayStr }),
    ]);

    if (!todayRes.success || todayRes.data.length === 0) {
      console.warn("No data found for today.");
      setIsLoading(false);
      return;
    }

    let todayData = todayRes.data.filter((item: { TransactionDate: string }) =>
      item.TransactionDate.startsWith(todayStr)
    );
    let yestData = yestRes.success
      ? yestRes.data.filter((item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(yesterdayStr)
        )
      : [];

    if (params.gameCategoryId && params.gameCategoryId > 0) {
      const allSummary = await fetchHistoricalSummary();

      const filteredTodaySummary = allSummary.data.filter(
        (item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(todayStr)
      );
      const filteredYestSummary = allSummary.data.filter(
        (item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(yesterdayStr)
      );

      todayData = historicalSummaryByRegionCategory(
        filteredTodaySummary,
        params.gameCategoryId
      );
      yestData = historicalSummaryByRegionCategory(
        filteredYestSummary,
        params.gameCategoryId
      );
    }

    const aggregateByRegion = (data: any[]) => {
      const map = new Map<number, RegionData>();
      data.forEach((entry) => {
        const existing = map.get(entry.RegionId);
        if (existing) {
          existing.TotalBetAmount += entry.TotalBetAmount;
        } else {
          map.set(entry.RegionId, {
            Region: entry.Region,
            TotalBetAmount: entry.TotalBetAmount,
          });
        }
      });
      return Array.from(map.entries());
    };

    const todayAggregated = aggregateByRegion(todayData).sort(
      (a, b) => b[1].TotalBetAmount - a[1].TotalBetAmount
    );
    const yestAggregated = aggregateByRegion(yestData).sort(
      (a, b) => b[1].TotalBetAmount - a[1].TotalBetAmount
    );

    const yestRankMap = new Map<number, number>();
    yestAggregated.forEach(([regionId], index) => {
      yestRankMap.set(regionId, index + 1);
    });

    const finalRanked = todayAggregated.map(([regionId, regionData], index) => {
      const todayRank = index + 1;
      const yestRank = yestRankMap.get(regionId);
      const trend = yestRank !== undefined ? yestRank - todayRank : 0;

      return {
        region: regionData,
        rank: todayRank,
        trend,
      };
    });

    setRankedRegions(finalRanked);
    setIsLoading(false);
  };

  useEffect(() => {
    getBettingRegions();
  }, [params.gameCategoryId]);

  return (
    <div className="w-full h-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaDiceSix size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">Top Betting Regions Today</p>
        </div>
        <div className="mt-2 md:mt-0">
          <button className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Comparison
          </button>
        </div>
      </div>

      <div className="border-b border-[#0038A8]" />

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-2 w-full overflow-y-auto">
          {rankedRegions.length === 0 ? (
            <div className="p-8 text-sm text-center text-[#888]">
              <p>Top Betting Regions Today</p>
              <p>Data will be displayed once available.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 text-sm font-semibold text-[#444] py-2 px-2">
                <div className="col-span-2 text-left">Rank</div>
                <div className="col-span-2 text-left">Trend</div>
                <div className="col-span-4 text-left">Region</div>
                <div className="col-span-4 text-right">Bets</div>
              </div>

              {(isMobile && !showAll
                ? rankedRegions.slice(0, 5)
                : rankedRegions
              ).map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center py-2 lg:py-3 px-2"
                >
                  <div className="col-span-2 text-md font-semibold text-[#444]">
                    {item.rank}
                  </div>

                  <div
                    className={`col-span-2 text-md font-semibold ${
                      item.trend > 0
                        ? "text-[#046115]"
                        : item.trend < 0
                          ? "text-[#CE1126]"
                          : "text-[#F6BA12]"
                    }`}
                  >
                    {item.trend > 0
                      ? `↑${item.trend}`
                      : item.trend < 0
                        ? `↓${Math.abs(item.trend)}`
                        : "—"}
                  </div>

                  <div className="col-span-4 text-[#0038A8] text-md truncate">
                    {item.region.Region}
                  </div>

                  <div className="col-span-4 text-right text-md text-[#212121]">
                    ₱{item.region.TotalBetAmount.toLocaleString()}
                  </div>
                </div>
              ))}

              {isMobile && rankedRegions.length > 5 && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs text-[#0038A8] hover:underline focus:outline-none"
                  >
                    {showAll ? "See Less" : "See More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TableBettingActivityToday;
