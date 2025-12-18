"use client";

import { useEffect, useState } from "react";
import { FaDiceSix, FaSpinner } from "react-icons/fa";
import { fetchHistoricalRegion, fetchHistoricalSummary } from "@/lib/api/transactions";
import { historicalSummaryByRegionCategory } from "@/utils/transforms";

interface RegionData {
  Region: string;
  TotalBetAmount: number;
}

interface RankedRegion {
  region: RegionData;
  rank: number;
  trend: number;
}

const TableBettingActivityToday = ({ gameCategoryId }: { gameCategoryId?: number }) => {
  const [rankedRegions, setRankedRegions] = useState<RankedRegion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getBettingRegions = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const todayStr = today.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

      // Fetch today's and yesterday's data in parallel (date-only)
      const [todayRes, yestRes] = await Promise.all([
        fetchHistoricalRegion({ from: todayStr, to: todayStr }),
        fetchHistoricalRegion({ from: yesterdayStr, to: yesterdayStr }),
      ]);

      if (!todayRes.success || !todayRes.data?.length) {
        console.warn("No data found for today.");
        setRankedRegions([]);
        return;
      }

      // Apply optional gameCategoryId filtering client-side
      const todayData = gameCategoryId
        ? historicalSummaryByRegionCategory(todayRes.data, gameCategoryId)
        : todayRes.data;

        console.log(todayData);

      const yestData = yestRes.success
        ? gameCategoryId
          ? historicalSummaryByRegionCategory(yestRes.data, gameCategoryId)
          : yestRes.data
        : [];

      // Aggregate bets by RegionId
      const aggregateByRegion = (data: any[]) => {
        const map = new Map<number, RegionData>();
        data.forEach((entry) => {
          const existing = map.get(entry.RegionId);
          if (existing) {
            existing.TotalBetAmount += entry.TotalBetAmount;
          } else {
            map.set(entry.RegionId, { Region: entry.Region, TotalBetAmount: entry.TotalBetAmount });
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

      // Map yesterday's rank for trend calculation
      const yestRankMap = new Map<number, number>();
      yestAggregated.forEach(([regionId], index) => yestRankMap.set(regionId, index + 1));

      // Compute today's rank and trend
      const finalRanked = todayAggregated.map(([regionId, regionData], index) => {
        const todayRank = index + 1;
        const yestRank = yestRankMap.get(regionId);
        const trend = yestRank !== undefined ? yestRank - todayRank : 0;

        return { region: regionData, rank: todayRank, trend };
      });

      setRankedRegions(finalRanked);
    } catch (error) {
      console.error("Error loading Top Betting Regions:", error);
      setRankedRegions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBettingRegions();
  }, [gameCategoryId]);

  return (
    <div className="w-full h-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaDiceSix size={20} color="#F6BA12" />
          </div>
          <p className="text-base ml-3">Top Betting Regions Today</p>
        </div>
      </div>

      <div className="border-b border-[#0038A8]" />

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <FaSpinner className="animate-spin h-8 w-8" />
        </div>
      ) : rankedRegions.length === 0 ? (
        <div className="p-8 text-sm text-center text-[#888]">
          <p>Top Betting Regions Today</p>
          <p>Data will be displayed once available.</p>
        </div>
      ) : (
        <div className="mt-2 w-full overflow-y-auto">
          <div className="grid grid-cols-12 text-sm font-semibold text-[#444] py-2 px-2">
            <div className="col-span-2 text-left">Rank</div>
            <div className="col-span-2 text-left">Trend</div>
            <div className="col-span-4 text-left">Region</div>
            <div className="col-span-4 text-right">Bets</div>
          </div>

          {(isMobile && !showAll ? rankedRegions.slice(0, 5) : rankedRegions).map((item, index) => (
            <div key={index} className="grid grid-cols-12 items-center py-2 lg:py-3 px-2">
              <div className="col-span-2 text-md font-semibold text-[#444]">{item.rank}</div>
              <div
                className={`col-span-2 text-md font-semibold ${
                  item.trend > 0 ? "text-[#046115]" : item.trend < 0 ? "text-[#CE1126]" : "text-[#F6BA12]"
                }`}
              >
                {item.trend > 0 ? `↑${item.trend}` : item.trend < 0 ? `↓${Math.abs(item.trend)}` : "—"}
              </div>
              <div className="col-span-4 text-[#0038A8] text-md truncate">{item.region.Region}</div>
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
        </div>
      )}
    </div>
  );
};

export default TableBettingActivityToday;
