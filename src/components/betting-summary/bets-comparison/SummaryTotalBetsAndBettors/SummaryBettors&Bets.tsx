"use client";

import { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { BettorsandBetsSummaryProps } from '../types';
import { fetchCompareHistoricalDate, fetchCompareHistoricalRange } from '~/utils/api/transactions';
import { formatDate, getGameCategoryParam } from '../utils';
import { processSpecificDatePayload, processDurationPayload } from './dataProcessors';
import { generateSeries } from './seriesGenerator';
import CustomLegend from '../CustomLegend';

const ChartBettorsAndBetsSummary: React.FC<BettorsandBetsSummaryProps> = ({
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

      if (dateFilter === "Specific Date" && firstDateSpecific && secondDateSpecific) {
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
          const processedData = processSpecificDatePayload(
            urlParam,
            resp.data,
            firstDateSpecific,
            secondDateSpecific
          );
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload for Specific Date:", resp);
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

        if (resp?.data?.DrawOrder) {
          const processedData = processDurationPayload(urlParam, resp.data);
          setChartData(processedData);
        } else {
          console.warn("Unexpected payload for Date Duration:", resp);
          setChartData([]);
        }
      } else {
        console.log("No matching condition for fetching data.");
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
    <div className="bg-transparent p-4 rounded-lg pb-8 w-full h-[511px] border border-[#7266C9]">
      <p className="text-[16px] font-normal leading-[18px] mb-[10px]">
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
      />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="h-full flex flex-col flex-grow">
          <BarChart
            height={350}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            series={generateSeries(chartData, urlParam, dateFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration)}
            yAxis={[{ scaleType: "band", data: ["First Draw", "Second Draw", "Third Draw"] }]}
            xAxis={[
              {
                label: "Total (x 100,000)",
                scaleType: "linear",
                min: 0,
                max: 750,
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
  );
};

export default ChartBettorsAndBetsSummary;