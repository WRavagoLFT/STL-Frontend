import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { fetchHistoricalRegion } from "~/utils/api/transactions";

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
    const today = new Date().toISOString().split('T')[0];

    console.log("Date Today, TopBettingRegion: ", today)
  
    // Assuming fetchHistoricalRegion accepts a date parameter
    const response = await fetchHistoricalRegion({ date: today });
  
    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }
  
    // Aggregate TotalBettors per RegionId using reduce()
    const regionMap: Map<number, RegionData> = response.data.reduce((map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void; }, entry: { RegionId: any; TotalBettors: any; }) => {
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
      .sort((a, b) => b.TotalBettors - a.TotalBettors)
      .filter(region => region.TotalBettors > 0);
  
    const ranked: { region: RegionData; rank: number; trend: "up" | "down" | "same" }[] =
      sortedRegions.slice(0, 5).map((region, index) => ({
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
    <Box sx={{ backgroundColor: "#171717", padding: 2, borderRadius: "10px" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F" }}>
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 2 }}>
          Top Betting Regions Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {/* Display Ranked Regions */}
      {rankedRegions.length > 0 ? (
        rankedRegions.map(({ region, rank, trend }) => (
          <Box key={region.RegionId} sx={{ display: "flex", alignItems: "center", padding: "5px 0" }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: trend === "up" ? "#4CAF50" : "#FF7A7A",
                }}
              >
                {rank}
              </Typography>
              {trend === "up" ? (
                <ArrowUpwardIcon sx={{ color: "#4CAF50", ml: 0.5, fontSize: 18 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: "#FF7A7A", ml: 0.5, fontSize: 18 }} />
              )}
            </Box>
            <Typography sx={{ color: "#fff", fontWeight: "bold", flex: 1, ml: 2 }}>
              {region.RegionFull}
            </Typography>
            <Typography sx={{ textAlign: "center", flex: 1 }}>
              {region.TotalBettors.toLocaleString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography sx={{ textAlign: "center", color: "#888" }}>
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default TopBettingRegionPage;
