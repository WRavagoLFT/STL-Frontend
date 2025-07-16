"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchWinners } from "@/lib/api/winners";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { TransactionData } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";

const CustomLegend = () => (
  <div className="flex flex-row space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#E5C7FF] mr-2" />
      <p className="text-xs md:text-sm">Winners</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-xs md:text-sm">Winnings</p>
    </div>
  </div>
);

const summary: Record<
  number,
  { gameName: string; winners: number; winnings: number }
> = {
  1: { gameName: "First Draw", winners: 0, winnings: 0 },
  2: { gameName: "Second Draw", winners: 0, winnings: 0 },
  3: { gameName: "Third Draw", winners: 0, winnings: 0 },
};

const ChartWinnersvsWinningsSummary = (params: {
  gameCategoryId?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { draw: string; winners: number; winnings: number; ratio: number }[]
  >([]);
  const [data, setData] = useState<
    { gameName: string; winners: number; winnings: number }[]
  >([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  const fetchData = async () => {
    try {
      const response = await fetchWinners({
        from: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }),
        to: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }),
        gameCategoryId: params.gameCategoryId,
      });

      if (response.success && Array.isArray(response.data)) {
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        });

        let filteredData = response.data.filter((item: TransactionData) => {
          if (!item.DateOfTransaction) return false;
          const localDate = new Date(item.DateOfTransaction).toLocaleDateString(
            "en-CA",
            { timeZone: "Asia/Manila" }
          );
          return localDate === today;
        });

        if (params.gameCategoryId) {
          filteredData = filteredData.filter(
            (item: TransactionData) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        const localSummary: typeof summary = {
          1: { gameName: "First Draw", winners: 0, winnings: 0 },
          2: { gameName: "Second Draw", winners: 0, winnings: 0 },
          3: { gameName: "Third Draw", winners: 0, winnings: 0 },
        };

        filteredData.forEach(
          (item: {
            DrawOrder: number;
            PayoutAmount: number;
          }) => {
            if (localSummary[item.DrawOrder]) {
              localSummary[item.DrawOrder].winners += 1;
              localSummary[item.DrawOrder].winnings += item.PayoutAmount || 0;
            }
          }
        );

        const formattedData = Object.values(localSummary);

        const scaledData = formattedData.map((item) => ({
          ...item,
          winnings: item.winnings,
          ratio: item.winners === 0 ? 0 : item.winnings / item.winners,
        }));

        setData(scaledData);

        const transformedChartData = scaledData.map((item) => ({
          draw: item.gameName,
          winners: item.winners,
          winnings: item.winnings,
          ratio: item.ratio,
        }));

        setChartData(transformedChartData);
      } else {
        console.error("API Request Failed:", response.message);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.gameCategoryId]);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary of Winners and Winnings Today
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={chartData}
              headers={["Draw", "Winners", "Winnings", "Winnings-to-Winner Ratio"]}
              title="Summary of Winners and Winnings per Draw"
              getRowData={(item) => [
                item.draw,
                item.winners,
                item.winnings,
                item.ratio,
              ]}
            />
          </div>
        )}
      </div>

      <div className="w-full pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <div className="min-w-[850px] md:min-w-[600px]">
            <BarChart
              height={300}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: { hidden: true },
                noDataOverlay: {
                  message:
                    "Summary of Winners and Winnings data will be displayed once available.",
                },
              }}
              dataset={chartData}
              series={[
                {
                  data: data.map((item) => item.winners / 100000),
                  color: "#E5C7FF",
                  label: "Winners",
                  valueFormatter: (value, context) =>
                    `${data[context.dataIndex].winners.toLocaleString()}`,
                },
                {
                  data: data.map((item) => item.winnings / 100000),
                  color: "#5050A5",
                  label: "Winnings",
                  valueFormatter: (value, context) =>
                    `₱${data[context.dataIndex].winnings.toLocaleString()}`,
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: chartData.map((item) => item.draw),
                },
              ]}
              xAxis={[
                {
                  label: "Total (x 100,000)",
                  scaleType: "linear",
                  min: 0,
                  max: 750,
                  tickInterval: 50,
                  valueFormatter: (value: number) => value.toString(),
                  tickSize: 2,
                  barCategoryGap: 0.2,
                  tickLabelProps: { style: { fontSize: "12px" } },
                } as any,
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartWinnersvsWinningsSummary;