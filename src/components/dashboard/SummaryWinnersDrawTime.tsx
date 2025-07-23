"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import GenericCSVExportButton from "../ui/buttons/CSVExportButtonDashboard";
import { useAuthStore } from "@/store/useAuthStore";

const drawLabelMap: Record<number, string> = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-8 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-1.5" />
      <p className="text-xs md:text-sm">Winners</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-1.5" />
      <p className="text-xs md:text-sm">Winnings</p>
    </div>
  </div>
);

interface Winner {
  GameCategoryId: number;
  DrawOrder: number;
  PayoutAmount?: number;
}

interface WinnersData {
  DrawOrder: number,
  Winners: number,
  Payout: number
}

interface WinnersProps {
  data: WinnersData[]
  loading?: boolean;
}

const SummaryWinnersDrawTimePage = ({ data, loading }: WinnersProps) => {
  const [chartData, setChartData] = useState<{ draw: string; winners: number; winnings: number }[]>([]);
  const currentUserType = useAuthStore((state) => state.userTypeId);

  useEffect(() => {
    setChartData(data.map((item) => ({
      draw: item.DrawOrder === 1 ? "First Draw" : item.DrawOrder === 2 ? "Second Draw" : "Third Draw",
      winners: item.Winners,
      winnings: item.Payout
    })));
  }, []);

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8] overflow-x-auto">
      <div className="w-full mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col leading-none">
          <p className="text-sm md:text-base lg:text-lg leading-none">
            Summary of Winners
          </p>
          <CustomLegend />
        </div>
        {currentUserType !== 3 && (
          <div className="mt-2 md:mt-0">
            <GenericCSVExportButton
              data={chartData}
              headers={["Draw", "Winners", "Winnings (in 100k)"]}
              title="Summary of Winners per Draw"
              getRowData={(item) => [
                item.draw,
                item.winners,
                item.winnings.toFixed(2),
              ]}
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
              margin={{ left: 90, right: 20, top: 20, bottom: 45 }}
              slotProps={{
                noDataOverlay: {
                  message:
                    "Summary of Winners data will be displayed once available.",
                },
                legend: { hidden: true },
              }}
              series={[
                {
                  data: chartData.map((item) => item.winners / 100000),
                  color: "#BB86FC",
                  label: "Winners",
                  valueFormatter: (value, context) =>
                    `${chartData[context.dataIndex].winners.toLocaleString()}`,
                },
                {
                  data: chartData.map((item) => item.winnings / 100000),
                  color: "#5050A5",
                  label: "Winnings",
                  valueFormatter: (value, context) =>
                    `₱${chartData[context.dataIndex].winnings.toLocaleString()}`,
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: chartData.map((item) => item.draw),
                  tickLabelProps: { style: { fontSize: "12px" } },
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

export default SummaryWinnersDrawTimePage;
