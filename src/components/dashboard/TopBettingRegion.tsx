import React, { useState, useEffect } from "react";
import { FaDiceSix } from "react-icons/fa";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { fetchHistoricalRegion } from "~/utils/api/transactions";
import router from "next/router";

interface RegionData {
  RegionId: number;
  Region: string;
  RegionFull: string;
  TotalBettors: number;
}

const TopBettingRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: "up" | "down" | "same" }[]
  >([]);

  const getBettingRegions = async () => {
    const today = new Date().toISOString().split("T")[0];

    console.log("Date Today, TopBettingRegion: ", today);

    // Assuming fetchHistoricalRegion accepts a date parameter
    const response = await fetchHistoricalRegion({ date: today });

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }
    const filteredData = response.data.filter(
      (item: { TransactionDate: string }) =>
        item.TransactionDate.startsWith(today)
    );

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
    const sortedRegions = Array.from(regionMap.values() as Iterable<RegionData>)
      .sort((a, b) => b.TotalBettors - a.TotalBettors)
      .filter((region) => region.TotalBettors > 0);

    const ranked: {
      region: RegionData;
      rank: number;
      trend: "up" | "down" | "same";
    }[] = sortedRegions.slice(0, 5).map((region, index) => ({
      region,
      rank: index + 1,
      trend: index % 2 === 0 ? "up" : "down",
    }));

    setRankedRegions(ranked);
  };

  useEffect(() => {
    getBettingRegions();
  }, []);

  return (
    <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaDiceSix size={24} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Top Betting Regions Today</p>
          <button
            onClick={() => { router.push("/betting-summary/dashboard");}} 
            className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Bettors
          </button>
        </div>
      </div>
      <div className="h-px bg-[#303030] mb-4" />

      {/* Display Ranked Regions */}
      {rankedRegions.length > 0 ? (
        rankedRegions.map(({ region, rank, trend }) => (
          <div key={region.RegionId} className="flex items-center py-1">
            <div className="flex items-center w-[15%]">
              <p
                className={`font-bold ${
                  trend === "up" ? "text-[#4CAF50]" : "text-[#FF7A7A]"
                }`}
              >
                {rank}
              </p>
              {trend === "up" ? (
                <ArrowUpward className="text-[#4CAF50] ml-1 w-4 h-4" />
              ) : (
                <ArrowDownward className="text-[#FF7A7A] ml-1 w-4 h-4" />
              )}
            </div>
            <p className="flex-1 ml-2">{region.RegionFull}</p>
            <p className="text-center flex-1">
              {region.TotalBettors.toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div className="p-8 text-sm text-center text-[#888]">
          <p>Top Betting Regions </p>
          <p> data will be displayed once available.</p>
        </div>
      )}
    </div>
  );
};

export default TopBettingRegionPage;
