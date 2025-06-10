import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { fetchHistoricalRegion, fetchHistoricalSummary, } from "~/utils/api/transactions";
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
  const [isLoading, setIsLoading] = useState(false);

  const getBettingRegions = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    //console.log("Date Today, TopBettingRegion: ", today);

    // Assuming fetchHistoricalRegion accepts a date parameter
    const response = await fetchHistoricalRegion({ date: today });

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }

    let filteredData = response.data.filter(
      (item: { TransactionDate: string }) =>
        item.TransactionDate.startsWith(today)
    );

    if (params.gameCategoryId && params.gameCategoryId > 0) {
      const historicalSummary = await fetchHistoricalSummary();
      const filteredSummary = historicalSummary.data.filter(
        (item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(today)
      );
      filteredData = historicalSummaryByRegionCategory(
        filteredSummary,
        params.gameCategoryId
      );
      console.log(filteredData);
    }

    // Aggregate TotalBettors per RegionId using reduce()
    const regionMap: Map<number, RegionData> = filteredData.reduce(
      (
        map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void },
        entry: { RegionId: any; TotalBettors: any }
      ) => {
        const existing = map.get(entry.RegionId);
        if (existing) {
          existing.TotalBettors += entry.TotalBettors;
        } else {
          map.set(entry.RegionId, { ...entry });
        }
        return map;
      },
      new Map<number, RegionData>()
    );

    // Convert to array and explicitly cast to RegionData[]
    const sortedRegions = Array.from(
      regionMap.values() as Iterable<RegionData>
    ).sort((a, b) => b.TotalBetAmount - a.TotalBetAmount);
    // .filter(region => region.TotalBetAmount > 0);

    const ranked: { region: RegionData; rank: number; trend: number }[] =
      sortedRegions.map((region, index) => ({
        region,
        rank: index + 1,
        trend: index,
      }));

    setRankedRegions(ranked);
    setIsLoading(false);
  };

  useEffect(() => {
    getBettingRegions();
  }, [params.gameCategoryId]);

  return (
    <div className="w-full flex-1 h-[52.4rem] bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaDiceSix size={24} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Top Betting Regions Today</p>
          <button className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Comparison
          </button>
        </div>
      </div>
      <div className="h-px bg-[#303030] mb-4" />
      {/* {isLoading ? (
        <div className="flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : ( */}
        <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
          {rankedRegions.length === 0 ? (
            <div className="p-8 text-sm text-center text-[#888]">
              <p>Top Betting Regions Today</p>
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

                <p className="text-[#212121] font-bold text-right flex-1 text-md">
                  ₱{item.region.TotalBetAmount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      {/* )} */}
    </div>
  );
};

export default TableBettingActivityToday;
