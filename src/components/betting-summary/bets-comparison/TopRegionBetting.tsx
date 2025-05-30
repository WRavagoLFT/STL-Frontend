import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BettorsandBetsSummaryProps, getLegendItemsMap_Specific, getLegendItemsMap_Duration, } from "../../../store/useBettingStore";
import { fetchCompareHistoricalDate, fetchCompareHistoricalRange } from "~/utils/api/transactions";

interface ChartData {
  region: string;
  firstValue: number | null;
  secondValue: number | null;
}

interface Region {
  TransactionDate: string;
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
  TransactionDate: string;
  DrawOrder: null | undefined;
  Region: string;
  GameCategory: null | undefined;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number | undefined;
  TotalSahod: number | undefined;
  TotalRamble: number | undefined;
  Rank: number;
}

interface DateRange {
  DrawOrder: null | undefined;
  Region: string;
  GameCategory: null | undefined;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number | undefined;
  TotalSahod: number | undefined;
  TotalRamble: number | undefined;
  DateRange: {
    StartDate: string;
    EndDate: string;
  };
  Rank: string;
}

const formatDate = (date: string | null): string => {
  if (!date) {
    throw new Error("Invalid date: null or undefined value provided");
  }
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to turn e.g. "IV-A" → "Region IV-A", but leave "NCR"/"CAR"/"BARMM" alone
const apiRegionLabel = (r: string) =>
  ["NCR", "CAR", "BARMM"].includes(r) ? r : `Region ${r}`;

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
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
    <div className="flex flex-row space-x-4 mt-1 mr-4">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <div
            className="w-[14px] h-[14px] rounded-full mr-1.5"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[12px] font-normal leading-[14px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const ChartTopRegionByBetsandBettors: React.FC<BettorsandBetsSummaryProps> = ({
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
  //console.log('Active Game Category:', activeGameType)

  // Determine which field to aggregated based on categoryFilter
  const aggregateField = categoryFilter.includes("Bets")
    ? "TotalBets"
    : "TotalBettors";

  // Determine chart number based on category
  const chartMap: Record<string, string> = {
    "Total Bets and Bettors": "1",
    "Total Bets by Bet Type": "2",
    "Total Bets by Game Type": "3",
    "Total Bettors by Bet Type": "5",
    "Total Bettors by Game Type": "6",
    "Top Betting Region by Total Bets": "4",
    "Top Betting Region by Total Bettors": "4",
  };

  const urlParam = chartMap[categoryFilter];
  //console.log('URL Param', urlParam)

  const gameCategoryMap: Record<string, number> = {
    Dashboard: 0,
    "STL Pares": 1,
    "STL Swer2": 2,
    "STL Swer3": 3,
    "STL Swer4": 4,
  };

  const gameCategoryParam = gameCategoryMap[activeGameType];

  // Add gameType parameter if activeGameType is valid (1-4)
  const getGameCategoryParam = () => {
    if (gameCategoryParam && gameCategoryParam >= 1 && gameCategoryParam <= 4) {
      return { gameCategory: gameCategoryParam };
    }
    return {};
  };

  // Specific Date
  const processSpecificPayloadData = (payload: {
    FirstDate: DateSpecific[];
    SecondDate: DateSpecific[];
  }) => {
    console.log("SPECIFIC DATE: Raw Payload:", payload);

    const data: ChartData[] = philippineRegions.map((region) => {
      const apiLabel = apiRegionLabel(region);

      const firstItem = payload.FirstDate.find(
        (r) => r.Region.toLowerCase() === apiLabel.toLowerCase()
      );
      const secondItem = payload.SecondDate.find(
        (r) => r.Region.toLowerCase() === apiLabel.toLowerCase()
      );

      const firstRank = firstItem && firstItem.TotalBets > 0 ? firstItem.Rank : null;
      const secondRank = secondItem && secondItem.TotalBets > 0 ? secondItem.Rank : null;

      return {
        region,
        firstValue: firstRank,
        secondValue: secondRank,
      };
    });

    console.table(
      data.map((d) => ({
        Region: d.region,
        FirstRank: d.firstValue ?? "N/A",
        SecondRank: d.secondValue ?? "N/A",
      }))
    );

    setChartData(data);
  };

  // Range Date
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
        firstValue: firstItem?.Rank ? parseInt(firstItem.Rank) : 0,
        secondValue: secondItem?.Rank ? parseInt(secondItem.Rank) : 0,
      };
    });
    setChartData(data);
  };

  // fetching the data
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const gameCategoryParam = getGameCategoryParam();

      // Check if required date values are available
      if (!firstDateSpecific || !secondDateSpecific) {
        console.warn("Missing required specific dates.");
        setLoading(false);
        return;
      }

      if (dateFilter === "Specific Date") {
        const formattedFirst = formatDate(firstDateSpecific);
        const formattedSecond = formatDate(secondDateSpecific);

        console.log("Fetching Specific Date with:", {
          first: formattedFirst,
          second: formattedSecond,
          ...gameCategoryParam,
        });

        const resp = await fetchCompareHistoricalDate(
          "/transactions/compareHistoricalDate/chartType/",
          urlParam,
          {
            first: formattedFirst,
            second: formattedSecond,
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.FirstDate && resp?.data?.SecondDate) {
          processSpecificPayloadData(resp.data);
        } else {
          console.warn("No data received for Specific Date", resp);
        }

      } else if (
        dateFilter === "Date Duration" &&
        firstDateDuration &&
        secondDateDuration
      ) {
        const formatted = {
          firstStart: formatDate(firstDateSpecific),
          firstEnd: formatDate(secondDateSpecific),
          secondStart: formatDate(firstDateDuration),
          secondEnd: formatDate(secondDateDuration),
          ...gameCategoryParam,
        };

        console.log("Fetching Date Duration with:", formatted);

        const resp = await fetchCompareHistoricalRange(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          formatted
        );

        if (resp?.data?.FirstRange && resp?.data?.SecondRange) {
          processRangePayloadData(resp.data);
        } else {
          console.warn("No data received for Date Duration", resp);
        }
      } else {
        console.warn("Missing date ranges for Date Duration");
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
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const interpolateMissing = (arr: (number | null)[]) => {
    let lastValid = 0;
    return arr.map((val) => {
      if (val == null) return lastValid;
      lastValid = val;
      return val;
    });
  };

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
            margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
            xAxis={[{ scaleType: "band", data: philippineRegions }]}
            slotProps={{ legend: { hidden: true } }}
            yAxis={[{ label: "Ranking", min: 0, max: 18 }]}
            series={[
              {
                data: interpolateMissing(chartData.map((item) => item.firstValue)),
                label:
                  dateFilter === "Specific Date"
                    ? `Ranking\n${firstDateSpecific}`
                    : `${firstDateSpecific} to ${secondDateSpecific}`,
                color: "#E5C7FF",
                curve: "linear",
              },
              {
                //data: chartData.map((item) => item.secondValue),
                data: interpolateMissing(chartData.map((item) => item.secondValue)),
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

export default ChartTopRegionByBetsandBettors;
