"use client";

import React, { useState, useEffect, useCallback } from "react";
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

        console.log('ULR PARAM: ', urlParam);

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

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
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
