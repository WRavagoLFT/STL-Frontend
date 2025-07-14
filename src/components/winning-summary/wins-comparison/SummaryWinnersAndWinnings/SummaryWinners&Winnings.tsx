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
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const urlParam = chartMap[categoryFilter]; // now checked.

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();
      if (
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

        console.log("URL PARAM: ", urlParam);
        if (resp?.data?.DrawOrder) {
          const processedData = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific,
            (dateString1: string, dateString2: string) =>
              formatDate(dateString1) === formatDate(dateString2)
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
        const resp = await fetchCompareHistoricalWinnersRange(
          "/winners/compareHistoricalWinnersRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateSpecific),
            firstEnd: formatDate(firstDateDuration),
            secondStart: formatDate(secondDateSpecific),
            secondEnd: formatDate(secondDateDuration),
            ...gameCategoryParam,
          }
        );

        if (resp?.data?.DrawOrder) {
          const processedData = processDurationPayload(urlParam, resp.data);
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload (Date Duration):", resp);
          setChartData([]);
        }
      } else {
        //console.log("No valid condition met for data fetching.");
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
