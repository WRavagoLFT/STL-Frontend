import { useEffect, useRef, useState } from "react";
import { FaDiceSix } from "react-icons/fa";
import { fetchWinners } from "~/lib/api/winners";
import { CircularProgress } from "@mui/material";

interface RegionData {
  Region: string;
  TotalPayout: number;
}

interface RankedRegion {
  region: RegionData;
  rank: number;
  trend: number;
}

const TableWinningActivityToday = (params: { gameCategoryId?: number }) => {
  const [rankedRegions, setRankedRegions] = useState<RankedRegion[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const previousRanksRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const updateScreenSize = () => setIsMobile(window.innerWidth < 768);
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    getWinningRegions();
  }, [params.gameCategoryId]);

  const getWinningRegions = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });
      const response = await fetchWinners({ from: today, to: today });

      if (!response.success || !response.data || response.data.length === 0) {
        console.warn("No winners found in API response.");
        setIsLoading(false);
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

      const sortedRegions = Array.from(regionMap.values())
        .sort((a, b) => b.TotalPayout - a.TotalPayout)
        .slice(0, 17);

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

      const newRankMap = new Map<string, number>();
      newRanked.forEach((item) => {
        newRankMap.set(item.region.Region, item.rank);
      });
      previousRanksRef.current = newRankMap;

      setRankedRegions(newRanked);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch winning regions:", error);
      setIsLoading(false);
    }
  };

  const visibleItems =
    isMobile && !showAll ? rankedRegions.slice(0, 5) : rankedRegions;

  return (
    <div className="w-full h-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="bg-[#0038A8] rounded-lg p-1">
            <FaDiceSix size={20} color={"#F6BA12"} />
          </div>
          <p className="text-base ml-3">Top Winning Regions Today</p>
        </div>
      </div>

      <div className="border-b border-[#0038A8]" />

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-2 w-full overflow-y-auto">
          {visibleItems.length === 0 ? (
            <div className="p-8 text-sm text-center text-[#888]">
              <p>Top Winning Regions Today</p>
              <p>Data will be displayed once available.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 text-sm font-semibold text-[#444] py-2 px-2">
                <div className="col-span-2 text-left">Rank</div>
                <div className="col-span-2 text-left">Trend</div>
                <div className="col-span-4 text-left">Region</div>
                <div className="col-span-4 text-right">Winnings</div>
              </div>

              {visibleItems.map((item, index) => (
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
                    ₱{item.region.TotalPayout.toLocaleString()}
                  </div>
                </div>
              ))}

              {isMobile && rankedRegions.length > 5 && (
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
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

export default TableWinningActivityToday;
