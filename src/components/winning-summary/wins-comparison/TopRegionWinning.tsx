import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  WinnersandWinningsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
} from "../../../store/useWinningStore";
import {
  fetchCompareHistoricalWinnersDate,
  fetchCompareHistoricalWinnersRange,
} from "~/utils/api/winners";

interface ChartData {
  region: string;
  firstValue: number;
  secondValue: number;
}
interface Region {
  TransactionDate: string; // ISO date string
  DrawOrder: number | null;
  Region: string;
  GameCategory: string | null;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
}
interface DateSpecific {
  DateOfWinningCombination: string;
  Region: string;
  TotalWinners: number;
  TotalPayoutAmount: number;
  TotalTumbokWinners: number;
  TotalSahodWinners: number;
  TotalRambleWinners: number;
  TotalTumbokPayouts: number;
  TotalSahodPayouts: number;
  TotalRamblePayouts: number;
  Rank: number;
}
interface DateRange {
  Region: string;
  TotalWinners: number;
  TotalPayoutAmount: number;
  Rank: number;
  DateOfWinningCombination: string;
}
const formatDate = (date: string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to turn e.g. "IV-A" → "Region IV-A", but leave "NCR"/"CAR"/"BARMM" alone
const apiRegionLabel = (r: string) =>
  ["NCR", "CAR", "BARMM"].includes(r) ? r : `Region ${r}`;

const CustomLegend: React.FC<WinnersandWinningsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  // Determine which legend items map to use based on the dateFilter
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific
        )
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific,
          firstDateDuration,
          secondDateDuration
        );

  return (
    <div className="flex flex-row space-x-4 mt-0.5 mr-4">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-[14px] h-[14px] rounded-full mr-1.5"
            style={{ backgroundColor: item.color }}
          />
          <p className="text-[#212121] text-[12px] font-normal leading-[14px]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const ChartTopRegionByWinsandWinners: React.FC<
  WinnersandWinningsSummaryProps
> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  activeGameType,
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const philippineRegions = [
    "NCR",
    "CAR",
    "I",
    "II",
    "III",
    "IV-A",
    "IV-B",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "BARMM",
  ];
  //console.log("Active Game Category:", activeGameType);

  // Determine which field to aggregated based on categoryFilter
  const aggregateField = categoryFilter.includes("Winnings")
    ? "TotalPayoutAmount"
    : "TotalWinners";

  // Determine chart number based on category
  const chartMap: Record<string, string> = {
    "Total Winnings and Winners": "1",
    "Total Winnings by Bet Type": "2",
    "Total Winnings by Game Type": "3",
    "Total Winners by Bet Type": "5",
    "Total Winners by Game Type": "6",
    "Top Winning Region by Total Winning": "4",
    "Top Winner Region by Total Winners": "4",
  };

  const urlParam = chartMap[categoryFilter];
  const gameCategoryMap: Record<string, number> = {
    Dashboard: 0,
    "STL Pares": 1,
    "STL Swer2": 2,
    "STL Swer3": 3,
    "STL Swer4": 4,
  };

  const gameCategoryParam = gameCategoryMap[activeGameType];
  //console.log('Game Category Param:', gameCategoryParam);
  //console.log('URL Param:', urlParam);

  // Add gameType parameter if activeGameType is valid (1-4)
  const getGameCategoryParam = () => {
    if (gameCategoryParam && gameCategoryParam >= 1 && gameCategoryParam <= 4) {
      return { gameType: gameCategoryParam };
    }
    return {};
  };

  // SpecificDate
  const processSpecificPayloadData = (payload: {
    FirstDate: DateSpecific[];
    SecondDate: DateSpecific[];
  }) => {
    const data: ChartData[] = philippineRegions.map((region) => {
      const apiLabel = apiRegionLabel(region);
      const firstItem = payload.FirstDate.find((r) => r.Region === apiLabel);
      const secondItem = payload.SecondDate.find((r) => r.Region === apiLabel);

      return {
        region,
        firstValue: firstItem?.Rank ?? 0,
        secondValue: secondItem?.Rank ?? 0,
      };
    });
    setChartData(data);
  };

  // SpecificDate
  const processRangePayloadData = (payload: {
    FirstRange: DateRange[];
    SecondRange: DateRange[];
  }) => {
    const data: ChartData[] = philippineRegions.map((region) => {
      const apiLabel = apiRegionLabel(region);
      const firstItem = payload.FirstRange.find((r) => r.Region === apiLabel);
      const secondItem = payload.SecondRange.find((r) => r.Region === apiLabel);

      return {
        region,
        firstValue: firstItem?.Rank ? firstItem.Rank : 0,
        secondValue: secondItem?.Rank ? secondItem.Rank : 0,
      };
    });
    setChartData(data);
  };

  // fetching the data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();
      if (
        dateFilter === "Specific Date" &&
        firstDateSpecific &&
        secondDateSpecific
      ) {
        console.log(
          "Fetching Specific Date:",
          formatDate(firstDateSpecific),
          formatDate(secondDateSpecific)
        );
        const resp = await fetchCompareHistoricalWinnersDate(
          "/winners/compareHistoricalWinners/chartType/",
          urlParam,
          {
            first: formatDate(firstDateSpecific),
            second: formatDate(secondDateSpecific),
            ...gameCategoryParam,
          }
        );
        console.log("Payload (Specific Date):", resp);
        // resp now has { FirstDate: [...], SecondDate: [...] }
        if (resp && resp.FirstDate && resp.SecondDate) {
          processSpecificPayloadData(resp);
        } else {
          console.warn("Unexpected payload:", resp);
        }
      } else if (
        dateFilter === "Date Duration" &&
        firstDateSpecific &&
        secondDateSpecific &&
        firstDateDuration &&
        secondDateDuration
      ) {
        console.log("Fetching Date Duration ranges");
        const resp = await fetchCompareHistoricalWinnersRange(
          "/winners/compareHistoricalWinnersRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateSpecific),
            firstEnd: formatDate(secondDateSpecific),
            secondStart: formatDate(firstDateDuration),
            secondEnd: formatDate(secondDateDuration),
            ...gameCategoryParam,
          }
        );
        console.log("Payload (Date Duration):", resp);
        // resp now has { FirstDate: [...], SecondDate: [...] }
        if (resp && resp.FirstRange && resp.SecondRange) {
          processRangePayloadData(resp);
        } else {
          console.warn("Unexpected payload:", resp);
        }
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    urlParam,
    aggregateField,
    gameCategoryParam,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //console.log('Chart Data:', chartData);

  return (
    <div className="bg-[#F8F0E3] p-4 rounded-lg pb-8 w-full h-[685px] border border-[#0038A8]">
      <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
        {`${categoryFilter}`}
      </p>

      <CustomLegend
        activeGameType={activeGameType}
        categoryFilter={categoryFilter}
        dateFilter={dateFilter}
        firstDateSpecific={firstDateSpecific}
        secondDateSpecific={secondDateSpecific}
        firstDateDuration={firstDateDuration}
        secondDateDuration={secondDateDuration}
      />

      <div className="h-full flex flex-col flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <LineChart
          height={500}
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          slotProps={{ legend: { hidden: true } }}
          xAxis={[
            {
              scaleType: "band",
              data: philippineRegions,
            },
          ]}
          yAxis={[
            {
              label: "Amount (in 100,000 units)",
              min: 0,
              max: 18,
            },
          ]}
          series={[
            {
              data: chartData.map((item) => item.firstValue),
              label:
                dateFilter === "Specific Date"
                  ? `Ranking\n${firstDateSpecific}`
                  : `${firstDateSpecific} to ${secondDateSpecific}`,
              color: "#E5C7FF",
              curve: "linear",
            },
            {
              data: chartData.map((item) => item.secondValue),
              label:
                dateFilter === "Specific Date"
                  ? `Ranking\n${secondDateSpecific}`
                  : `${firstDateDuration} to ${secondDateDuration}`,
              color: "#3E2466",
              curve: "linear",
            },
          ]}
          grid={{ horizontal: true }}
        />
        )}
      </div>
    </div>
  );
};

export default ChartTopRegionByWinsandWinners;
