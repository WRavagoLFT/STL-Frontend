"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { BettorsandBetsSummaryProps } from "../types";
import { formatDate, getGameCategoryParam } from "../utils";
import { processSpecificDatePayload, processDurationPayload } from "./dataProcessors";
import { generateSeries } from "./seriesGenerator";
import GenericCSVExportButton from "../../../ui/buttons/CSVExportButtonDashboard";
import CustomLegend from "../CustomLegend";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCompareHistoricalDate, fetchCompareHistoricalRange } from "@/lib/api/transactions";
import { FaSpinner } from "react-icons/fa";

const ChartBettorsAndBetsSummary: React.FC<BettorsandBetsSummaryProps> = ({
  gameCategoryId,
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  secondDurationFrom,
  secondDurationTo,
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam(gameCategoryId);

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

        if (resp?.data?.DrawOrder) {
          const processed = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific
          );
          setChartData(processed);
        } else {
          setChartData([]);
        }
      } else if (
        dateFilter === "Date Duration" &&
        firstDateDuration &&
        secondDateDuration &&
        secondDurationFrom &&
        secondDurationTo
      ) {
        const resp = await fetchCompareHistoricalRange(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateDuration),
            firstEnd: formatDate(secondDateDuration),
            secondStart: formatDate(secondDurationFrom),
            secondEnd: formatDate(secondDurationTo),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.DrawOrder) {
          const processed = processDurationPayload(urlParam, resp.data);
          setChartData(processed);
        } else {
          setChartData([]);
        }
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
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
    secondDurationFrom,
    secondDurationTo,
    urlParam,
    gameCategoryId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartSeries = useMemo(() => {
    return generateSeries(
      chartData,
      urlParam,
      dateFilter,
      firstDateSpecific,
      secondDateSpecific,
      firstDateDuration,
      secondDateDuration,
      secondDurationFrom,
      secondDurationTo,
      gameCategoryId ?? null
    );
  }, [
    chartData,
    urlParam,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    secondDurationFrom,
    secondDurationTo,
    gameCategoryId,
  ]);

  const formatWithCommas = (num: number): string =>
    new Intl.NumberFormat("en-US").format(num);

  const getCSVHeaders = () => ["Draw Order", ...chartSeries.map((s) => s.label || "")];

  const getRowData = (label: string) => {
    const index = ["First Draw", "Second Draw", "Third Draw"].indexOf(label);
    return [
      label,
      ...chartSeries.map((s) =>
        formatWithCommas(Number(s.data?.[index] || 0) * 100000)
      ),
    ];
  };

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col xl:flex-row xl:items-center xl:justify-between">
        
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary {categoryFilter}
          </p>
          <CustomLegend
            gameCategoryId={gameCategoryId}
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={firstDateSpecific}
            secondDateSpecific={secondDateSpecific}
            firstDateDuration={firstDateDuration}
            secondDateDuration={secondDateDuration}
            secondDurationFrom={secondDurationFrom}
            secondDurationTo={secondDurationTo}
          />
        </div>

        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-4 xl:mt-0">
            <GenericCSVExportButton
              data={["First Draw", "Second Draw", "Third Draw"]}
              headers={getCSVHeaders()}
              title={`Summary of ${categoryFilter}`}
              filename={`${categoryFilter.replace(/\s+/g, "_")}_${new Date()
                .toISOString()
                .slice(0, 10)}`}
              getRowData={getRowData}
            />
          </div>
        )}
      </div>

      <div className="h-full w-full mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="min-w-[1000px] md:min-w-[600px]">
            <BarChart
              height={350}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              series={chartSeries}
              yAxis={[
                {
                  scaleType: "band",
                  data: ["First Draw", "Second Draw", "Third Draw"],
                },
              ]}
              xAxis={[
                {
                  label: "Total (x 100,000)",
                  scaleType: "linear",
                  min: 0,
                  max: 1000,
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

export default ChartBettorsAndBetsSummary;
