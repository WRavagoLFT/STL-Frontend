"use client";

import { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { BettorsandBetsSummaryProps } from "../../../../store/useBettingStore";
import {
  fetchCompareHistoricalDate,
  fetchCompareHistoricalRange,
} from "~/utils/api/transactions";
import { formatDate, getGameCategoryParam } from "../utils";
import {
  processSpecificDatePayload,
  processDurationPayload,
} from "./dataProcessorsRegional";
import { generateSeries } from "./seriesGeneratorRegional";
import CustomLegend from "../CustomLegend";
import GenericCSVExportButton from "../../../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "~/store/useAuthStore";

const ChartBettorsAndBetsRegionalSummary: React.FC<
  BettorsandBetsSummaryProps
> = ({
  gameCategoryId,
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const chartMap: Record<string, string> = {
    "Total Bettors and Bets": "1",
    "Total Bets by Bet Type": "2",
    "Total Bets by Game Type": "3",
    "Total Bettors by Bet Type": "5",
    "Total Bettors by Game Type": "6",
    "Top Betting Region by Total Bets": "4",
    "Top Betting Region by Total Bettors": "4",
  };
  const urlParam = chartMap[categoryFilter];

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();

      if (
        dateFilter === "Specific Date" &&
        firstDateSpecific &&
        secondDateSpecific
      ) {
        const resp = await fetchCompareHistoricalDate(
          "/transactions/compareHistoricalDate/chartType/",
          urlParam,
          {
            first: formatDate(firstDateSpecific),
            second: formatDate(secondDateSpecific),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.Region) {
          const processedData = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific
          );
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload (Specific Date):", resp);
          setChartData([]);
        }
      } else if (
        dateFilter === "Date Duration" &&
        firstDateSpecific &&
        secondDateSpecific &&
        firstDateDuration &&
        secondDateDuration
      ) {
        const resp = await fetchCompareHistoricalRange(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateSpecific),
            firstEnd: formatDate(secondDateSpecific),
            secondStart: formatDate(firstDateDuration),
            secondEnd: formatDate(secondDateDuration),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.Region) {
          const processedData = processDurationPayload(urlParam, resp.data);
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload (Date Duration):", resp);
          setChartData([]);
        }
      } else {
        console.log("No valid condition met for data fetching.");
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
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

  const formatWithCommas = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getCSVData = () => {
    if (!chartData || chartData.length === 0) return [];

    const series = generateSeries(
      chartData,
      urlParam,
      dateFilter,
      firstDateSpecific,
      secondDateSpecific,
      firstDateDuration,
      secondDateDuration
    );

    return philippineRegions.map((region, index) => {
      const row: Record<string, string | number> = { Region: region };

      series.forEach((seriesItem) => {
        const value = seriesItem.data[index] || 0;
        const originalValue = value * 100000;
        row[seriesItem.label || ""] = formatWithCommas(originalValue);
      });

      return row;
    });
  };

  const getCSVHeaders = () => {
    const series = generateSeries(
      chartData,
      urlParam,
      dateFilter,
      firstDateSpecific,
      secondDateSpecific,
      firstDateDuration,
      secondDateDuration
    );

    return ["Region", ...series.map((s) => s.label || "")];
  };

  const getRowData = (item: any) => {
    const series = generateSeries(
      chartData,
      urlParam,
      dateFilter,
      firstDateSpecific,
      secondDateSpecific,
      firstDateDuration,
      secondDateDuration
    );

    const regionIndex = philippineRegions.indexOf(item.Region);
    if (regionIndex === -1) return [item.Region];

    return [
      item.Region,
      ...series.map((s) =>
        formatWithCommas((s.data[regionIndex] || 0) * 100000)
      ),
    ];
  };

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Regional Summary of {categoryFilter}
          </p>
          <CustomLegend
            gameCategoryId={gameCategoryId}
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={firstDateSpecific}
            secondDateSpecific={secondDateSpecific}
            firstDateDuration={firstDateDuration}
            secondDateDuration={secondDateDuration}
          />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-4 xl:mt-0">
            <GenericCSVExportButton
              data={getCSVData()}
              headers={getCSVHeaders()}
              title={`Regional Summary of ${categoryFilter}`}
              filename={`Regional_Summary_${categoryFilter.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`}
              getRowData={getRowData}
            />
          </div>
        )}
      </div>

      <div className="h-full w-full mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[1000px] md:min-w-[600px]">
            <BarChart
              height={400}
              grid={{ horizontal: true }}
              margin={{ left: 70, right: 20, top: 20, bottom: 80 }}
              series={generateSeries(
                chartData,
                urlParam,
                dateFilter,
                firstDateSpecific,
                secondDateSpecific,
                firstDateDuration,
                secondDateDuration
              )}
              xAxis={[
                {
                  scaleType: "band",
                  data: philippineRegions,
                  label: "Regions",
                },
              ]}
              yAxis={[
                {
                  label: "Total (x 100,000)",
                  scaleType: "linear",
                  min: 0,
                  max: 100,
                  tickInterval: 50,
                  valueFormatter: (value: number) => value.toString(),
                  tickSize: 2,
                  tickLabelProps: { style: { fontSize: "12px" } },
                } as any,
              ]}
              slotProps={{ legend: { hidden: true } }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartBettorsAndBetsRegionalSummary;
