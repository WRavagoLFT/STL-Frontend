import React, { useState, useEffect } from "react";
import { FaDiceSix } from "react-icons/fa";
import { fetchHistoricalRegion } from "~/utils/api/transactions";
import router from "next/router";
import { useAuthStore } from "~/store/useAuthStore";

interface RegionData {
  RegionId?: number;
  Region: string;
  RegionFull?: string;
  TotalPayout?: number;
  trend?: number;
  TotalBettors: number;
  TotalBetAmount: number;
}

const TopBettingRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: number }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const bettingLabel =
    currentUserType === 3
      ? "Top Betting Area Today"
      : "Top Betting Regions Today";

  const getBettingRegions = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const response = await fetchHistoricalRegion({ date: today });
      //console.log("DATE TODAY:", today);

      if (!response.success || !response.data || response.data.length === 0) {
        console.warn("No data returned from API.");
        return;
      }

      const filteredData = response.data.filter((entry: any) => {
        const entryDate = entry.TransactionDate?.split("T")[0]; // 'YYYY-MM-DD'
        return entryDate === today;
      });

      if (filteredData.length === 0) {
        console.warn("No matching entries for today's date.");
        return;
      }

      // Group by Region and sum TotalBetAmount
      const regionMap = new Map<string, RegionData>();

      filteredData.forEach((entry: any) => {
        const regionName = entry.Region || "Unknown";
        const payout = entry.TotalPayout || 0;
        const betAmount = entry.TotalBetAmount || 0;

        if (betAmount === 0) return; // Skip regions with 0 total bets

        if (regionMap.has(regionName)) {
          const existing = regionMap.get(regionName)!;
          existing.TotalPayout += payout;
          existing.TotalBettors += entry.TotalBettors || 0;
          existing.TotalBetAmount += betAmount;
        } else {
          regionMap.set(regionName, {
            RegionId: entry.RegionId,
            Region: regionName,
            RegionFull: entry.RegionFull || regionName,
            TotalPayout: payout,
            TotalBettors: entry.TotalBettors || 0,
            TotalBetAmount: betAmount,
          });
        }
      });

      const sortedRegions = Array.from(regionMap.values()).sort(
        (a, b) => b.TotalBetAmount - a.TotalBetAmount
      );

      const ranked = sortedRegions.map((region, index) => ({
        region,
        rank: index + 1,
        trend: 0,
      }));

      setRankedRegions(ranked);
    } catch (error) {
      console.error("Failed to fetch winning regions:", error);
    }
  };

  useEffect(() => {
    getBettingRegions();
  }, []);

  return (
    <div className="w-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Left side: icon + label */}
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaDiceSix size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">{bettingLabel}</p>
        </div>

        {/* Right side: button */}
        <div className="mt-2 md:mt-0">
          <button
            onClick={() => router.push("/betting-summary/dashboard")}
            className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            View Bettors
          </button>
        </div>
      </div>

      <div className="h-px bg-[#ACA993] mt-1 mb-2" />

      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {rankedRegions.length === 0 ? (
          <div className="p-8 text-sm text-center text-[#888]">
            <p>Top Winning Regions</p>
            <p>Data will be displayed once available.</p>
          </div>
        ) : (
          rankedRegions.map((item, index) => (
            <div
              key={item.region.RegionId ?? item.region.Region}
              className={`flex items-center py-2 ${
                index === rankedRegions.length - 1 ? "border-none" : ""
              }`}
            >
              <div className="flex items-center w-[15%]">
                <span
                  className={`font-bold text-md ${
                    item.trend > 0
                      ? "text-[#046115]"
                      : item.trend < 0
                        ? "text-[#CE1126]"
                        : "text-[#aaa]"
                  }`}
                >
                  {item.trend > 0
                    ? `↑${item.trend}`
                    : item.trend < 0
                      ? `↓${Math.abs(item.trend)}`
                      : "→"}
                </span>
              </div>

              <p className="text-[#0038A8] flex-1 ml-2 text-md whitespace-nowrap overflow-hidden text-ellipsis">
                {item.region.Region}
              </p>

              <p className="text-[#212121] text-right flex-1 text-md">
                ₱ {(item.region.TotalBetAmount ?? 0).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopBettingRegionPage;
