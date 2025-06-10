import { useEffect, useRef, useState } from "react";
import { FaDiceSix } from "react-icons/fa";
import { fetchWinners } from "~/utils/api/winners";

interface RegionData {
  Region: string;
  TotalPayout: number;
}

interface RankedRegion {
  region: RegionData;
  rank: number;
  trend: number; // negative = moved up, positive = moved down
}

const TableWinningActivityToday = (params: { gameCategoryId?: number }) => {
  const [rankedRegions, setRankedRegions] = useState<RankedRegion[]>([]);
  const previousRanksRef = useRef<Map<string, number>>(new Map());

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

      let filteredData = response.data;

      if (params.gameCategoryId && params.gameCategoryId > 0) {
        filteredData = filteredData.filter(
          (entry: { GameCategoryId: number }) =>
            entry.GameCategoryId === params.gameCategoryId
        );
      }

      const regionMap = new Map<string, RegionData>();

      filteredData.forEach((entry: any) => {
        const regionName = entry.Region;
        const payout = entry.PayoutAmount;

        if (regionMap.has(regionName)) {
          regionMap.get(regionName)!.TotalPayout += payout;
        } else {
          regionMap.set(regionName, {
            Region: regionName,
            TotalPayout: payout,
          });
        }
      });

      const sortedRegions = Array.from(regionMap.values()).sort(
        (a, b) => b.TotalPayout - a.TotalPayout
      );

      const newRanked: RankedRegion[] = sortedRegions.map((region, index) => {
        const regionName = region.Region;
        const newRank = index + 1;
        const previousRank = previousRanksRef.current.get(regionName);
        const trend = previousRank ? previousRank - newRank : 0;

        return {
          region,
          rank: newRank,
          trend,
        };
      });

      // Update reference to previous ranks for next comparison
      const newRankMap = new Map<string, number>();
      newRanked.forEach((item) => {
        newRankMap.set(item.region.Region, item.rank);
      });
      previousRanksRef.current = newRankMap;

      setRankedRegions(newRanked);
    } catch (error) {
      console.error("Failed to fetch winning regions:", error);
    }
  };

  useEffect(() => {
    getWinningRegions();
  }, [params.gameCategoryId]);

  return (
    <div className="w-full flex-1 h-[53.1rem] bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaDiceSix size={24} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Top Winning Regions Today</p>
          <button className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Comparison
          </button>
        </div>
      </div>
      <div className="h-px bg-[#ACA993] mt-1 mb-2" />
      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {rankedRegions.length === 0 ? (
          <div className="p-8 text-sm text-center text-[#888]">
            <p>Top Winning Regions Today</p>
            <p>Data will be displayed once available.</p>
          </div>
        ) : (
          rankedRegions.map((item, index) => (
            <div
              key={index}
              className={`flex items-center py-2 ${
                index === rankedRegions.length - 1 ? "border-none" : ""
              }`}
            >
              <div className="flex items-center w-[15%]">
                <span
                  className={`font-bold text-md ${
                    item.trend > 0
                      ? "text-[#CE1126]" // moved down
                      : item.trend < 0
                      ? "text-[#046115]" // moved up
                      : "text-[#aaa]" // no change
                  }`}
                >
                  {item.trend > 0
                    ? `↓${Math.abs(item.trend)}`
                    : item.trend < 0
                    ? `↑${Math.abs(item.trend)}`
                    : "→"}
                </span>
              </div>

              <p className="text-[#0038A8] flex-1 ml-2 text-md whitespace-nowrap overflow-hidden text-ellipsis">
                {item.region.Region}
              </p>

              <p className="text-[#212121] font-bold text-right flex-1 text-md">
                ₱{item.region.TotalPayout.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TableWinningActivityToday;
