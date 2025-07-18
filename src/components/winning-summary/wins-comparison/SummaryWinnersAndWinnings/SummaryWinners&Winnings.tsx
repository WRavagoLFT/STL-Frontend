"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { WinnersandWinningsSummaryProps } from "../types";
import {
  fetchCompareHistoricalWinnersDate,
  fetchCompareHistoricalWinnersRange,
} from "@/lib/api/winners";
import { formatDate, getGameCategoryParam } from "../utils";
import {
  processSpecificDatePayload,
  processDurationPayload,
} from "./dataProcessor";
import { generateSeries } from "./seriesGenerator";
import { CustomLegend } from "../CustomLegend";
import { drawOrders, chartMap } from "../constant";
import GenericCSVExportButton from "@/components/ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "@/store/useAuthStore";

const SummaryWinnersAndWinnings: React.FC<WinnersandWinningsSummaryProps> = ({
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

  const urlParam = chartMap[categoryFilter];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam(gameCategoryId);

      console.log("DATE FILTER:", dateFilter);

      // DATE DURATION HAS PRIORITY
      if (
        dateFilter === "Date Duration" &&
        firstDateDuration &&
        secondDateDuration &&
        secondDurationFrom &&
        secondDurationTo
      ) {
        const resp = await fetchCompareHistoricalWinnersRange(
          "/winners/compareHistoricalWinnersRange/chartType/",
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
          console.warn("Unexpected payload (Date Duration):", resp);
          setChartData([]);
        }

        // FALLBACK TO SPECIFIC DATE
      } else if (
        dateFilter === "Specific Date" &&
        firstDateSpecific &&
        secondDateSpecific
      ) {
        const resp = await fetchCompareHistoricalWinnersDate(
          "/winners/compareHistoricalWinners/chartType/",
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
            secondDateSpecific,
            (dateString1: string, dateString2: string) =>
              formatDate(dateString1) === formatDate(dateString2)
          );
          setChartData(processed);
        } else {
          console.warn("Unexpected payload (Specific Date):", resp);
          setChartData([]);
        }

        // INVALID OR INCOMPLETE STATE
      } else {
        console.log("No valid condition met for data fetching.");
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

  const getCSVHeaders = () => [
    "Draw Order",
    ...chartSeries.map((s) => s.label || ""),
  ];

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
        
        <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
          {`Summary of ${categoryFilter}`}
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
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[1000px] md:min-w-[600px]">
            <BarChart
              height={350}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 20 }}
              series={generateSeries(
                chartData,
                urlParam,
                dateFilter,
                firstDateSpecific,
                secondDateSpecific,
                firstDateDuration,
                secondDateDuration
              )}
              yAxis={[
                {
                  scaleType: "band",
                  data: drawOrders.map(
                    (order) =>
                      `${order === 1 ? "First" : order === 2 ? "Second" : "Third"} Draw`
                  ),
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

export default SummaryWinnersAndWinnings;
