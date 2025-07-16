"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "@/store/useAuthStore";

const CustomLegend = () => (
  <div className="flex flex-row space-x-5 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p className="text-xs md:text-sm">Bettors</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p className="text-xs md:text-sm">Bets</p>
    </div>
  </div>
);

const summary: Record<
  number,
  { gameName: string; bettors: number; bets: number; winners: number }
> = {
  1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
  2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
  3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
};

interface BettingSummaryData {
  DrawOrder: number;
  Bettors: number,
  Bets: number
}

interface BettingSummaryProps {
  data: BettingSummaryData[]
}

const SummaryBettorsBetsPlacedPage = (data: BettingSummaryProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  useEffect(() => {
    setChartData(data.data.map((item) => ({
      gameName: item.DrawOrder === 1 ? "First Draw" : item.DrawOrder === 2 ? "Second Draw" : "Third Draw",
      bettors: item.Bettors,
      bets: item.Bets
    })))
    setLoading(false)
  }, []);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary of Bettors and Bets Placed Today
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={chartData}
              headers={["Game Name", "Bettors", "Bets"]}
              title="Bettors and Bets Summary"
              getRowData={(item) => [item.gameName, item.bettors, item.bets]}
            />
          </div>
        )}
      </div>

      <div className="h-full w-full mt-4">
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
                noDataOverlay: {
                  message:
                    "Summary of Bettors and Bets Placed data will be displayed once available.",
                },
                legend: { hidden: true },
              }}
              series={[
                {
                  data: chartData.map((item) => item.bettors / 100000),
                  color: "#BB86FC",
                  label: "Bettors",
                  valueFormatter: (value, context) =>
                    `${chartData[context.dataIndex].bettors.toLocaleString()}`,
                },
                {
                  data: chartData.map((item) => item.bets / 100000),
                  color: "#5050A5",
                  label: "Bets",
                  valueFormatter: (value, context) =>
                    `₱${chartData[context.dataIndex].bets.toLocaleString()}`,
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: chartData.map((item) => item.gameName),
                  tickLabelProps: { style: { fontSize: "14px" } },
                } as any,
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

export default SummaryBettorsBetsPlacedPage;
