"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  BettorsandBetsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
} from "../../../store/useBettingStore";
import {
  fetchCompareHistoricalDate,
  fetchCompareHistoricalRange,
} from "@/lib/api/transactions";
import { FaSpinner } from "react-icons/fa";

interface ChartData {
  region: string;
  firstValue: number;
  secondValue: number;
}

interface RegionRangeData {
  Region: string;
  DateOfWinningCombination: string;
  Rank?: number;
  TotalPayoutAmount?: number;
  TotalWinners?: number;
  TotalBets?: number;
  TotalBettors?: number;
}

const formatDate = (date: string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const apiRegionLabel = (r: string) =>
  ["NCR", "CAR", "BARMM"].includes(r) ? r : `Region ${r}`;

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = (props) => {
  const { dateFilter, categoryFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration } = props;

  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(categoryFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration);

  return (
    <div className="flex flex-row space-x-4 mt-1 mr-4">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-[14px] h-[14px] rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
          <span className="text-[12px] font-normal leading-[14px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const ChartTopRegionByBetsandBettors: React.FC<BettorsandBetsSummaryProps> = ({
  gameCategoryId,
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const philippineRegions = [
    "NCR", "CAR", "I", "II", "III", "IV-A", "IV-B", "V", "VI", "VII",
    "VIII", "IX", "X", "XI", "XII", "XIII", "BARMM",
  ];

  const aggregateField = categoryFilter.includes("Bets") ? "TotalBets" : "TotalBettors";

  const chartMap: Record<string, string> = {
    "Total Bettors and Bets": "1",
    "Total Bets by Bet Type": "2",
    "Total Bets by Game Type": "3",
    "Total Bettors by Bet Type": "5",
    "Total Bettors by Game Type": "6",
    "Top Betting Region by Total Bets": "4",
    "Top Betting Region by Total Bettors": "5",
  };

  const urlParam = chartMap[categoryFilter];

  const getGameCategoryParam = () => {
    return gameCategoryId && gameCategoryId >= 1 && gameCategoryId <= 4
      ? { gameCategory: gameCategoryId }
      : {};
  };

  const processSpecificPayloadData = (payload: any) => {
    const normalize = (r: string) => r.toLowerCase().replace(/[\s\-]/g, "");

    const data: ChartData[] = philippineRegions.map((region) => {
      const apiLabel = apiRegionLabel(region);
      const firstItem = payload.FirstDate.find((r: any) => normalize(r.Region) === normalize(apiLabel));
      const secondItem = payload.SecondDate.find((r: any) => normalize(r.Region) === normalize(apiLabel));

      return {
        region,
        firstValue: firstItem?.[aggregateField] ?? 0,
        secondValue: secondItem?.[aggregateField] ?? 0,
      };
    });

    setChartData(data);
  };

  const processRangePayloadData = (payload: {
    FirstRange?: RegionRangeData[];
    SecondRange?: RegionRangeData[];
  }) => {
    const data: ChartData[] = philippineRegions.map((region) => {
      const normalized = region.toLowerCase().replace(/\s+/g, "");

      const firstItem = payload.FirstRange?.find((r) =>
        r.Region.toLowerCase().replace(/\s+/g, "").includes(normalized)
      );

      const secondItem = payload.SecondRange?.find((r) =>
        r.Region.toLowerCase().replace(/\s+/g, "").includes(normalized)
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();

      if (dateFilter === "Specific Date") {
        if (!firstDateSpecific || !secondDateSpecific) return;

        const resp = await fetchCompareHistoricalDate(
          "/transactions/compareHistoricalDate/chartType/",
          urlParam,
          {
            first: formatDate(firstDateSpecific),
            second: formatDate(secondDateSpecific),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.FirstDate && resp?.data?.SecondDate) {
          processSpecificPayloadData(resp.data);
        }
      } else if (
        dateFilter === "Date Duration" &&
        firstDateDuration &&
        secondDateDuration &&
        firstDateSpecific &&
        secondDateSpecific
      ) {
        const resp = await fetchCompareHistoricalRange(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          {
          firstStart: formatDate(firstDateDuration),
          firstEnd: formatDate(secondDateDuration),
          secondStart: formatDate(firstDateSpecific),
          secondEnd: formatDate(secondDateSpecific),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.FirstRange && resp?.data?.SecondRange) {
          processRangePayloadData(resp.data);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    gameCategoryId,
    aggregateField,
    urlParam,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-[#F8F0E3] p-4 rounded-lg pb-8 w-full h-[685px] border border-[#0038A8]">
      <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
        {categoryFilter}
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
            <FaSpinner className="animate-spin h-8 w-8" />
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
                data: (chartData.map((item) => item.firstValue)),
                label:
                  dateFilter === "Specific Date"
                    ? `Ranking\n${firstDateSpecific}`
                    : `${firstDateSpecific} to ${secondDateSpecific}`,
                color: "#E5C7FF",
                curve: "linear",
              },
              {
                data: (chartData.map((item) => item.secondValue)),
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
