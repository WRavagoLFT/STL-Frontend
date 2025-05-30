import { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import MoneyIcon from "@mui/icons-material/AttachMoney";
//import { fetchWinners } from "~/utils/api/winners";
import { fetchHistoricalRegion, fetchHistoricalSummary } from "~/utils/api/transactions";
import { historicalSummaryByRegionCategory } from "~/utils/transforms";
import { FaDiceSix } from "react-icons/fa";
// import fetchHistoricalRegion from "~/utils/api/getHistoricalRegion";

// Define types
interface RegionData {
  Region: string;
  TotalPayout: number;
  trend?: number;
}

const TableWinningActivityToday = (params: {gameCategoryId?: number}) => {
  const [rankedRegions, setRankedRegions] = useState<
        { region: RegionData; rank: number; trend: number }[]
      >([]);
  
      const getWinningRegions = async () => {
        const today = new Date().toISOString().split('T')[0];
  
        const response = await fetchHistoricalRegion();
      
        if (!response.success || response.data.length === 0) {
          console.warn("No data found in API response!");
          return;
        }

        let filteredData = response.data.filter(
          (item: { TransactionDate: string }) =>
            item.TransactionDate.startsWith(today)
        );

        if(params.gameCategoryId && params.gameCategoryId > 0) {
          const historicalSummary = await fetchHistoricalSummary();
          const filteredSummary = historicalSummary.data.filter(
            (item: { TransactionDate: string }) =>
              item.TransactionDate.startsWith(today)
          )
          filteredData = historicalSummaryByRegionCategory(filteredSummary, params.gameCategoryId);
          console.log(filteredData)
        }
      
        // Aggregate TotalBettors per RegionId using reduce()
        const regionMap: Map<number, RegionData> = filteredData.reduce((map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void; }, entry: { RegionId: any; TotalBettors: any; }) => {
          const existing = map.get(entry.RegionId);
          if (existing) {
            existing.TotalBettors += entry.TotalBettors;
          } else {
            map.set(entry.RegionId, { ...entry });
          }
          return map;
        }, new Map<number, RegionData>());
      
        // Convert to array and explicitly cast to RegionData[]
        const sortedRegions = Array.from(regionMap.values() as Iterable<RegionData>)
          .sort((a, b) => b.TotalPayout - a.TotalPayout)
          // .filter(region => region.TotalBetAmount > 0);
      
        const ranked: { region: RegionData; rank: number; trend: number }[] =
          sortedRegions.map((region, index) => ({
            region,
            rank: index + 1,
            trend: index,
          }));
      
        setRankedRegions(ranked);
      };
      
      useEffect(() => {
        getWinningRegions();
      }, []);

  return (
    <div className="w-full flex-1 h-[53.5rem] bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
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
      <div className="h-px bg-[#303030] mb-4" />
      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {rankedRegions.map((item, index) => (
          <div
            key={index}
            className={`flex items-center py-2 ${
              index === rankedRegions.length - 1 ? "border-none" : ""
            }`}
          >
            <div className="flex items-center w-[15%]">
              <span
                className={`font-bold text-[0.85rem] ${
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

            <p className="text-[#0038A8] flex-1 ml-2 text-[0.9rem] whitespace-nowrap overflow-hidden text-ellipsis">
              {item.region.Region}
            </p>

            <p className="text-[#212121] font-bold text-right flex-1 text-[0.95rem]">
              ₱{item.region.TotalPayout.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableWinningActivityToday;
