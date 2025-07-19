"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "./dataProcessorRegional";
import { generateSeries } from "./seriesGeneratorRegional";
import { CustomLegend } from "../CustomLegend";
import { philippineRegions, chartMap } from "../constant";
import GenericCSVExportButton from "../../../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "@/store/useAuthStore";

const RegionalSummaryWinnersAndWinnings: React.FC<
  WinnersandWinningsSummaryProps
> = ({
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
  //console.log("gameCategoryId:", gameCategoryId);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);
  const hasFetchedRef = useRef(false);

  const urlParam = chartMap[categoryFilter];
  console.log('CATEG FILTER: ', categoryFilter);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam(gameCategoryId);

      console.log("DATE FILTER:", urlParam);

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

        console.log(urlParam);

        console.log(firstDateDuration, secondDateDuration, secondDurationFrom, secondDurationTo )

        if (resp?.data?.DrawOrder) {
          const processed = processDurationPayload(urlParam, resp.data);
          setChartData(processed);
        } 
        
        else {
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

  // useEffect(() => {
  //    if (!hasFetchedRef.current) {
  //      fetchData();
  //      hasFetchedRef.current = true;
  //    }
  //  }, [fetchData]);

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
      secondDateDuration,
      secondDurationFrom, 
      secondDurationTo 
    );

    console.log("Series for BarChart:", series);

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
      secondDateDuration,
      secondDurationFrom,
      secondDurationTo
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
      secondDateDuration,
      secondDurationFrom,
      secondDurationTo
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
            secondDurationFrom={secondDurationFrom}
            secondDurationTo={secondDurationTo}
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
                secondDateDuration,
                secondDurationFrom, 
                secondDurationTo,
                gameCategoryId ?? null
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
                  max: 500,
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

export default RegionalSummaryWinnersAndWinnings;
