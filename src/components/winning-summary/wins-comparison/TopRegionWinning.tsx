import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  WinnersandWinningsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
} from "../../../store/useWinningStore";
import {
  fetchCompareHistoricalWinnersDate,
  fetchCompareHistoricalWinnersRange,
} from "@/lib/api/winners";

interface ChartData {
  region: string;
  firstValue: number;
  secondValue: number;
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

type RegionField = "TotalPayoutAmount" | "TotalWinners";

type RegionRangeData = {
  Region: string;
  DateOfWinningCombination: string;
  Rank?: number;
  TotalPayoutAmount?: number;
  TotalWinners?: number;
};

const formatDate = (date: string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertToRankArray = (values: number[]): number[] => {
  // Create a sorted array of unique non-zero values
  const sortedUnique = Array.from(new Set(values.filter((v) => v > 0))).sort(
    (a, b) => b - a
  );

  return values.map((val) => {
    if (!val) return 0;
    return sortedUnique.indexOf(val) + 1;
  });
};

const apiRegionLabel = (r: string) =>
  ["NCR", "CAR", "BARMM"].includes(r) ? r : `Region ${r}`;

const CustomLegend: React.FC<WinnersandWinningsSummaryProps> = ({
  gameCategoryId,
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
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
  gameCategoryId,
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

  const aggregateField: RegionField = categoryFilter.includes("Winnings")
    ? "TotalPayoutAmount"
    : "TotalWinners";

  const chartMap: Record<string, string> = {
    "Total Winnings and Winners": "1",
    "Total Winnings by Bet Type": "2",
    "Total Winnings by Game Type": "3",
    "Total Winners by Bet Type": "5",
    "Total Winners by Game Type": "6",
    "Top Winning Region by Total Winning": "4",
    "Top Winner Region by Total Winners": "5",
  };

  const urlParam = chartMap[categoryFilter] ?? "4";

  const getGameCategoryParam = () => {
    if (gameCategoryId && gameCategoryId >= 1 && gameCategoryId <= 4) {
      return { gameCategory: gameCategoryId };
    }
    return {};
  };

  const processSpecificPayloadData = (payload: {
    FirstDate: DateSpecific[];
    SecondDate: DateSpecific[];
  }) => {
    const normalize = (r: string) => r.toLowerCase().replace(/[\s\-]/g, "");

    const data: ChartData[] = philippineRegions.map((region) => {
      const apiLabel = apiRegionLabel(region);

      const firstItem = payload.FirstDate.find(
        (r) => normalize(r.Region) === normalize(apiLabel)
      );

      const secondItem = payload.SecondDate.find(
        (r) => normalize(r.Region) === normalize(apiLabel)
      );

      return {
        region,
        firstValue: firstItem?.[aggregateField] ?? 0,
        secondValue: secondItem?.[aggregateField] ?? 0,
      };
    });

    console.table(data);
    setChartData(data);
  };

  const processRangePayloadData = (payload: {
    FirstRange?: RegionRangeData[];
    SecondRange?: RegionRangeData[];
  }) => {
    const { FirstRange, SecondRange } = payload;

    if (!Array.isArray(FirstRange) || !Array.isArray(SecondRange)) {
      console.error("Invalid Region data:", payload);
      return;
    }

    const data: ChartData[] = philippineRegions.map((region) => {
      const normalizedRegionName = region.toLowerCase().replace(/\s+/g, "");

      const firstItem = FirstRange.find((r) =>
        r.Region.toLowerCase()
          .replace(/\s+/g, "")
          .includes(normalizedRegionName)
      );

      const secondItem = SecondRange.find((r) =>
        r.Region.toLowerCase()
          .replace(/\s+/g, "")
          .includes(normalizedRegionName)
      );

      return {
        region,
        firstValue: firstItem?.[aggregateField] ?? 0,
        secondValue: secondItem?.[aggregateField] ?? 0,
      };
    });

    setChartData(data);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();
      console.log("DATE FILTER:", dateFilter);

      const isValidDateDuration =
        dateFilter === "Date Duration" &&
        firstDateDuration &&
        secondDateDuration;

      const isValidSpecificDate =
        dateFilter === "Specific Date" &&
        firstDateSpecific &&
        secondDateSpecific;

      if (isValidDateDuration) {
        const payload = {
          firstStart: formatDate(firstDateDuration),
          firstEnd: formatDate(secondDateDuration),
          ...gameCategoryParam,
        };

        const resp = await fetchCompareHistoricalWinnersRange(
          "/winners/compareHistoricalWinnersRange/chartType/",
          urlParam,
          payload
        );

        if (resp?.data?.DrawOrder || resp?.data?.FirstRange) {
          processRangePayloadData(resp.data);
        } else {
          console.warn("Unexpected payload (Date Duration):", resp);
          setChartData([]);
        }
      } else if (isValidSpecificDate) {
        const payload = {
          first: formatDate(firstDateSpecific),
          second: formatDate(secondDateSpecific),
          ...gameCategoryParam,
        };

        const resp = await fetchCompareHistoricalWinnersDate(
          "/winners/compareHistoricalWinners/chartType/",
          urlParam,
          payload
        );

        if (resp?.data?.DrawOrder || resp?.data?.FirstDate) {
          processSpecificPayloadData(resp.data);
        } else {
          console.warn("Unexpected payload (Specific Date):", resp);
          setChartData([]);
        }
      } else {
        console.warn("No valid condition met for data fetching.");
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
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
    gameCategoryId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const maxY = Math.max(
    ...chartData.map((item) => Math.max(item.firstValue, item.secondValue))
  );
  return (
    <div className="bg-[#F8F0E3] p-4 rounded-lg pb-8 w-full h-[685px] border border-[#0038A8]">
      <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
        {`${categoryFilter}`}
      </p>

      <CustomLegend
        gameCategoryId={gameCategoryId}
        categoryFilter={categoryFilter}
        dateFilter={dateFilter}
        firstDateSpecific={firstDateSpecific}
        secondDateSpecific={secondDateSpecific}
        firstDateDuration={firstDateDuration}
        secondDateDuration={secondDateDuration}
        secondDurationFrom={null}
        secondDurationTo={null}
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
                label: "Rank",
                min: 0,
                max: 18,
              },
            ]}
            series={[
              {
                data: convertToRankArray(
                  chartData.map((item) => item.firstValue)
                ),
                label:
                  dateFilter === "Specific Date"
                    ? `Ranking\n${firstDateSpecific}`
                    : `${firstDateSpecific} to ${secondDateSpecific}`,
                color: "#E5C7FF",
                curve: "linear",
              },
              {
                data: convertToRankArray(
                  chartData.map((item) => item.secondValue)
                ),
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
