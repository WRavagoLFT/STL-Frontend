import React, { useState, useEffect } from "react";
import { fetchWinners } from "~/utils/api/winners";
import { FaMoneyBillAlt } from "react-icons/fa";
import router from "next/router";

// Define RegionData type
interface RegionData {
  RegionId?: number;
  Region: string;
  RegionFull?: string;
  TotalWinners?: number;
  TotalPayout: number;
  trend?: number;
}

const TopWinningRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: number }[]
  >([]);

  const getWinningRegions = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetchWinners({
        from: today,
        to: today,
      });

      if (!response.success || !response.data || response.data.length === 0) {
        console.warn("No winners found in API response.");
        return;
      }

      //console.log('TOTAL WINNERS IN THE TOP WINNING REGION:', response.data);

      const filteredData = response.data;

      // Group by Region and sum PayoutAmount
      const regionMap = new Map<string, RegionData>();

      filteredData.forEach((entry: any) => {
        const regionName = entry.Region || "Unknown";
        const payout = entry.PayoutAmount || 0;

        if (payout === 0) return;

        if (regionMap.has(regionName)) {
          const existing = regionMap.get(regionName)!;
          existing.TotalPayout += payout;
          existing.TotalWinners = (existing.TotalWinners || 0) + 1;
        } else {
          regionMap.set(regionName, {
            RegionId: entry.RegionId,
            Region: regionName,
            RegionFull: entry.RegionFull || regionName,
            TotalPayout: payout,
            TotalWinners: 1,
          });
        }
      });

      const sortedRegions = Array.from(regionMap.values()).sort(
        (a, b) => b.TotalPayout - a.TotalPayout
      );

      const ranked = sortedRegions.map((region, index) => ({
        region,
        rank: index + 1,
        trend: 0, // Default stub, update later if needed
      }));

      setRankedRegions(ranked);
    } catch (error) {
      console.error("Failed to fetch winning regions:", error);
    }
  };

  useEffect(() => {
    getWinningRegions();
  }, []);

  return (
    <div className="w-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaMoneyBillAlt size={20} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Top Winning Regions Today</p>
          <button
            onClick={() => router.push("/winning-summary/dashboard")}
            className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            View Winners
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
                {item.region.RegionFull}
              </p>

              <p className="text-[#212121] text-right flex-1 text-md">
                {(item.region.TotalPayout ?? 0).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopWinningRegionPage;
